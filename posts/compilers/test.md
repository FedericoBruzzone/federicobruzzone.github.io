```rust
pub struct Cursor {
    pub input: String,
    pub position: usize,
    pub offset: usize,
}

impl Cursor {
    pub fn new(input: String) -> Cursor {
        Cursor { input, position: 0, offset: 0, }
    }

    pub fn is_eof(&self) -> bool {
        self.position >= self.input.len()
    }

    pub fn peek(&self) -> Option<char> {
        if self.is_eof() { return None; }

        self.input.chars().nth(self.offset)
    }

    pub fn consume(&mut self) {
        if self.is_eof() { return; }

        self.position += 1;
        self.offset += 1;
    }

    pub fn advance(&mut self) {
        if self.is_eof() { return; }

        self.offset += 1;
    }

    pub fn align(&mut self) {
        if self.is_eof() { return; }

        self.position = self.offset;
        self.offset += 1;
    }
}
```

