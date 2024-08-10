```rust
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
```

