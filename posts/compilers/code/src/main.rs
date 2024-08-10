#[derive(Debug)]
pub struct Token {
    pub kind: TokenKind,
    pub lexeme: String,
}

#[derive(Debug)]
pub enum TokenKind {
    Identifier,
    Number,
    EOF,
}

pub struct Cursor {
    pub input: String,
    pub position: usize,
    pub offset: usize,
}

impl Cursor {
    pub fn new(input: String) -> Cursor {
        Cursor {
            input,
            position: 0,
            offset: 0,
        }
    }

    pub fn is_eof(&self) -> bool {
        self.offset >= self.input.len()
    }

    pub fn peek(&self) -> Option<char> {
        if self.is_eof() {
            return None;
        }

        self.input.chars().nth(self.offset)
    }

    pub fn advance(&mut self) {
        if self.is_eof() {
            return;
        }

        self.offset += 1;
    }

    pub fn align(&mut self) {
        if self.is_eof() {
            return;
        }

        self.position = self.offset;
        self.offset += 1;
    }
}

pub trait State {
    fn visit(&self, cursor: &mut Cursor) -> Option<Transition>;
}

pub struct Transition {
    pub state: Box<dyn State>,
    pub transition_kind: TransitionKind,
}

pub enum TransitionKind {
    Advance,
    EmitToken(Token),
    End,
}

impl TransitionKind {
    pub fn apply(&self, cursor: &mut Cursor) {
        match self {
            TransitionKind::Advance => cursor.advance(),
            TransitionKind::EmitToken(_) => cursor.align(),
            TransitionKind::End => {}
        }
    }
}

pub struct Lexer {
    cursor: Cursor,
    state: Box<dyn State>,
}

impl Lexer {
    pub fn new(input: String) -> Lexer {
        Lexer {
            cursor: Cursor::new(input),
            state: Box::new(StateStart),
        }
    }

    pub fn proceed(state: Box<dyn State>, transition_kind: TransitionKind) -> Transition {
        Transition {
            state,
            transition_kind,
        }
    }
}

impl Iterator for Lexer {
    type Item = Token;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            let transition = self.state.visit(&mut self.cursor)?;
            if let TransitionKind::End = transition.transition_kind {
                return None;
            }
            self.state = transition.state;
            transition.transition_kind.apply(&mut self.cursor);
            if let TransitionKind::EmitToken(token) = transition.transition_kind {
                return Some(token);
            }
        }
    }
}

#[derive(Debug)]
pub struct StateStart;

impl State for StateStart {
    fn visit(&self, cursor: &mut Cursor) -> Option<Transition> {
        match cursor.peek() {
            Some(c) if c.is_alphabetic() => {
                Some(Lexer::proceed(Box::new(StateWord), TransitionKind::Advance))
            }
            Some(c) if c.is_numeric() => Some(Lexer::proceed(
                Box::new(StateNumber),
                TransitionKind::Advance,
            )),
            _ => Some(Lexer::proceed(Box::new(StateEOF), TransitionKind::Advance)),
        }
    }
}

#[derive(Debug)]
pub struct StateWord;

impl State for StateWord {
    fn visit(&self, cursor: &mut Cursor) -> Option<Transition> {
        match cursor.peek() {
            Some(c) if c.is_alphanumeric() => {
                Some(Lexer::proceed(Box::new(StateWord), TransitionKind::Advance))
            }
            _ => Some(Lexer::proceed(
                Box::new(StateStart),
                TransitionKind::EmitToken(Token {
                    kind: TokenKind::Identifier,
                    lexeme: cursor.input[cursor.position..cursor.offset].to_string(),
                }),
            )),
        }
    }
}

#[derive(Debug)]
pub struct StateNumber;

impl State for StateNumber {
    fn visit(&self, cursor: &mut Cursor) -> Option<Transition> {
        match cursor.peek() {
            Some(c) if c.is_numeric() => Some(Lexer::proceed(
                Box::new(StateNumber),
                TransitionKind::Advance,
            )),
            _ => Some(Lexer::proceed(
                Box::new(StateStart),
                TransitionKind::EmitToken(Token {
                    kind: TokenKind::Number,
                    lexeme: cursor.input[cursor.position..cursor.offset].to_string(),
                }),
            )),
        }
    }
}

#[derive(Debug)]
pub struct StateEOF;

impl State for StateEOF {
    fn visit(&self, _cursor: &mut Cursor) -> Option<Transition> {
        Some(Transition {
            state: Box::new(StateEnd),
            transition_kind: TransitionKind::EmitToken(Token {
                kind: TokenKind::EOF,
                lexeme: "".to_string(),
            }),
        })
    }
}

#[derive(Debug)]
pub struct StateEnd;

impl State for StateEnd {
    fn visit(&self, _cursor: &mut Cursor) -> Option<Transition> {
        panic!("StateEnd should not be visited");
    }
}


fn main() {
    let input = "hello world 01234 56789".to_string();
    let lexer = Lexer::new(input);
    for token in lexer {
        println!("{:?}", token);
    }
}
