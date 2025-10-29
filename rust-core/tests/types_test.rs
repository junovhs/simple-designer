//! Integration tests for types module.

use simple_designer_core::{Color, Point, Rect};

#[test]
fn point_creation() {
    let p = Point::new(10.0, 20.0).unwrap();
    assert_eq!(p.x, 10.0);
    assert_eq!(p.y, 20.0);
}

#[test]
fn rect_contains() {
    let r = Rect::new(0.0, 0.0, 100.0, 100.0).unwrap();
    let p = Point::new(50.0, 50.0).unwrap();
    assert!(r.contains_point(p));
}

#[test]
fn color_limits() {
    let c = Color::new(1.5, -0.5, 0.5, 0.5);
    assert!(c.r <= 1.0 && c.r >= 0.0);
    assert!(c.g <= 1.0 && c.g >= 0.0);
}