---
date: 2022-01-16
tags: 
  - rust
  - rails
---

# Use Rust In Rails

## reference

<https://medium.com/@naltun/rust-ruby-and-ffi-programming-6a4ab403020d>

## setup

```sh
bundle add ffi
mkdir -p lib/ffi
cd lib/ffi
cargo init --lib
```

## code

```toml
# lib/ffi/cargo.toml
[package]
name = "ffi"
version = "0.1.0"
authors = ["yanjinkai <iamtmoe@163.com>"]
edition = "2018"

[lib]
name = "mapi"
crate-type = ["dylib"]

[dependencies]
libc = "0.2.0"
sysinfo = "0.8.0"
walkdir = "2.2.7"
```

---

```rs
// lib/ffi/src/lib.rs
extern crate walkdir;

use walkdir::WalkDir;

#[no_mangle]
pub extern fn get_files_count() -> usize {
    let path = "/";
    let files_count = WalkDir::new(path).into_iter().count();
    
    return files_count;
}  
```

---

```rb
# lib/ffi/mapi.rb
module MAPI
  extend FFI::Library
  ffi_lib "./lib/ffi/target/release/libmapi.#{FFI::Platform::LIBSUFFIX}"
  attach_function :get_files_count, [], :int
end
```

---

```rb
# app/controllers/home_controller.rb
def hello
    render plain: MAPI.get_files_count.to_s
end
```

---

```Dockerfile
# Dockerfile
FROM rust:1.58-slim-buster as native_builder

RUN mkdir -p /app

WORKDIR /app

COPY lib/ffi ./

RUN cargo build --release
# ...
FROM ruby:2.6.6-slim-buster
COPY --from=native_builder /app/target /app/lib/ffi/target
```

## check

```sh
docker build . -t rust-ffi-test
docker run --rm -it --name=rust-ffi-test -p3000:3000 rust-ffi-test
curl localhost:3000/hello
```
