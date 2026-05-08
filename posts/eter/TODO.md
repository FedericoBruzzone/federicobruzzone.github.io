NO BIT-A-BIT COPY ON MOVE
---
ECCEZIONI NO
---
SUBSCRIPT CHE FANNO TIPO SWAP NO
---
SINTASSI INCASINATA, VORREI CHE FOSSE UGUALE (CONSISETNTE)
---
hylo: non mi piace var e let (dovrebbero essere gestiti dal regime)
---
Ecco l'elenco dettagliato delle problematiche che lui vede nel tuo approccio:

1. Il problema del valore di ritorno (The "Return" Problem)

In Eter, tu hai stabilito che un proj non può essere restituito (ret proj v[0] è errore). Il tizio vede questo come un limite enorme per:

Accessors efficienti: Non puoi scrivere una funzione get_element(index) che restituisca una proiezione mutabile dell'elemento. L'utente deve sempre scrivere il path completo (es. my_array[0]) o usare una closure.

Componibilità: Non puoi incapsulare la logica di ricerca. Se vuoi una funzione che trovi "il cliente con il saldo più alto" e ti permetta di modificarlo, in Eter non puoi restituire quella "finestra" (proiezione) sul cliente.

2. Closure (Funzioni anonime)

Le closure sono "oggetti" che catturano variabili dal contesto circostante.

Cattura per riferimento: Se una closure cattura una variabile in regime mut o mov tramite una proiezione (proj), quella closure sta essenzialmente diventando una struct che contiene un riferimento.

Il conflitto: Se Eter proibisce di mettere i proj nelle struct, allora le closure non possono catturare riferimenti mutabili che sopravvivano alla funzione corrente. Questo rende difficile implementare sistemi di callback o programmazione asincrona efficiente.

3. Iteratori (Il cuore del problema)

In Rust o C++, un iteratore è una struct che contiene un puntatore alla collezione e un indice/puntatore all'elemento corrente.

In Eter: Poiché un iteratore deve "vivere" durante il ciclo for, esso dovrebbe contenere una proiezione della collezione. Ma tu proibisci di mettere proj nelle strutture dati.

Il vicolo cieco: Senza poter mettere proj in una struct, non puoi creare un oggetto Iterator. Dovresti inventare un modo completamente nuovo per iterare che non usi oggetti persistenti, il che limita l'espressività del linguaggio.

4. Slices (Sottoporzioni di dati)

Le slice (es. "prendi i primi 10 elementi di questo array") sono fondamentali.

Di solito, una slice è una struct con [puntatore, lunghezza]. In Eter, questo sarebbe un proj su una porzione di memoria.

Se non puoi passare questa struct "Slice" liberamente o restituirla, perdi la capacità di scrivere algoritmi generici che lavorano su sottoparti di collezioni senza copiare i dati.

5. Astrazione e Generici (Code Duplication)

Lui menziona il problema di Optional<T>.

Se hai un tipo generico T, e vuoi un Optional che possa contenere una proiezione (per dire "forse ho una proiezione su questo dato, forse no"), in Eter non puoi farlo perché proj è di seconda classe.

Dovresti creare un tipo speciale OptionalProj<T>, duplicando la logica. Questo porta a quello che lui chiama "fango semantico": il programmatore deve distinguere continuamente tra il tipo "valore" e il tipo "proiezione" in tutta la gerarchia dei tipi.

6. La sfida della "Stabilità delle API"

Lui avverte che se provi a risolvere questi problemi con l'inferenza automatica dei lifetime (cioè il compilatore capisce da solo quanto deve vivere un proj senza che tu lo scriva), rischi di rompere il codice altrui.

Se cambi un dettaglio interno a una funzione, il compilatore potrebbe decidere che un proj ora deve vivere più a lungo.

Questo cambierebbe la "firma invisibile" della funzione, rompendo il codice di chi usa la tua libreria senza che ci sia stato un cambio esplicito nel codice.

---

// ==================================
// Array Indexing & Path Isolation
// ==================================
fn main() {
    let mut x: [i32; 3] = [10, 20, 30];
    let proj p1 = &x[0]; 
    let proj p2 = &x[1];
    let proj p3 = &x[0]; // ERROR: Path isolation violation.
    // QUI PER LA SEMANTICA ATTUALE POTREI MUOVERE x ALTROVE.
    // IL COMPILATORE NON RIESCE A LEGARE x A p1 E A p2.
    // ANALISI INTRAPROCEDURAMENTE NON è UNA SOLUZIONE, TROPPO COSTOSA.
    &p1 = 100;
}
// NOTE:
// The subscript operator can be seen as the following function:
// fn subscript<T, const N: usize, const I: usize>(a: proj [T; N]) -> proj T {
//     ret &a[I];
// }

// fn iter<const N: usize>(mut x: [i32; N]) -> Iter<i32, N> { ... }
// fn collect<T, const N: usize>(mut it: Iter<T, N>) -> [T; N] { ... }
// fn next<T, const N: usize>(it: proj Iter<T, N>) -> proj T {
//     let i = it.cursor;
//     if i >= N { abort(); }
//     &it.cursor = i + 1;
//     ret &it.data[i]; 
// }
let mut x: [i32; 3] = [1, 2, 3];
let mut it = x.iter(); // x is moved into the iterator
// Single Projection Rule for Methods: If a proj method returns a proj derived from 
// its input, the caller may not invoke that method again (or any other proj/mut method 
// on the same object) until the previous projection has expired.
while let proj el = it.next() {
    &el += 10; 
}
x = it.collect();

---

// ==================================
// Struct Projections & Field Isolation
// ==================================
fn main() {
    let mut p = Point { x: 10, y: 20 };
    
    let proj px = &p.x; 
    let proj py = &p.y; // OK: I path 'p.x' e 'p.y' sono staticamente disgiunti.
    
    &px = 100;
    &py = 200; // Entrambi modificabili in-place simultaneamente.
    
    // let proj p_all = &p; // ERROR: Path 'p' è bloccato perché i suoi rami (.x, .y) sono occupati.
}

---

// ==================================
// Method Projection (Getter/Setter)
// ==================================
// Se il metodo è inline, il compilatore vede il path reale
inline fn get_x(p: proj Point) -> proj i32 {
    ret &p.x;
}

fn test() {
    let mut p = Point { x: 1, y: 2 };
    let proj my_x = p.get_x(); // Legato a p.x
    
    let proj my_y = &p.y; // OK: Il compilatore sa che get_x ha impegnato solo .x
    
    &my_x = 5;
}

---

struct Iter {
    mut data: [i32; 3],
    mut cursor: usize,
}

fn iter(mut x: [i32; 3]) -> Iter<i32, 3> {
    ret Iter { data: x, cursor: 0 };
}

fn collect(mut it: Iter<i32, 3>) -> [i32; 3] {
    ret it.data;
}

fn map(proj it: Iter<i32, 3>, proj f: Fn(proj i32) -> ()) -> i32 {
    while i < it.data.len() {
      f(it.data[i]);
      i++;
    }
}

fn main() {
    let mut x: [i32; 3] = [1, 2, 3];
    let mut it = iter(x); // x is moved into the iterator
    it.map(|el| {&el += 10;});
    x = collect(it);
}
