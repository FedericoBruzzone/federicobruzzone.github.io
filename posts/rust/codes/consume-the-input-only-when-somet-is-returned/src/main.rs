









fn foo<T: std::fmt::Debug>(p: Option<T>) -> Option<String>
{
    if p.is_some() {
        return Some(format!("{:?}", p));
    }
    None
}

#[derive(Debug)]
struct ZST;

fn main() {
    let input = ZST;
    match foo(Some(input)) {
        Some(x) => {
            // Do something with x
        }
        None => {
            let x = input;
        }
    }
}
