// MANDATE: Tauri commands, <60 SLOC per function

/// Get application version.
#[tauri::command]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Initialize canvas dimensions.
#[tauri::command]
pub fn init_canvas(width: u32, height: u32) -> Result<String, String> {
    // MANDATE: Input validation
    if width == 0 || height == 0 {
        return Err("Invalid dimensions".into());
    }
    if width > 4096 || height > 4096 {
        return Err("Dimensions too large".into());
    }
    
    println!("Canvas initialized: {}x{}", width, height);
    Ok(format!("{}x{}", width, height))
}