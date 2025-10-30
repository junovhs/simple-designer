// MANDATE: Tauri entry point
#![deny(warnings)]
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            println!("Simple Designer started");
            println!("Window: {:?}", window.title());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_version,
            commands::init_canvas,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}