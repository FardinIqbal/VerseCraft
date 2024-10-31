# VerseCraft Design System

## Architecture

The design system is organized into four main layers:

### 1. Base Layer (`/base`)
- `_variables.scss`: Single source of truth for all design tokens.
- `_foundation.scss`: Core utility functions and helpers.
- `_mixins.scss`: Reusable style patterns.
- `_reset.scss`: Baseline style reset.
- `_typography.scss`: Typography implementation.
- `_utilities.scss`: Utility classes.

### 2. Layout Layer (`/layout`)
- Core layout patterns.
- Grid systems.
- Responsive behaviors.

### 3. Components (`/components`)
- Individual UI components.
- Self-contained styles following BEM methodology.

### 4. Pages (`/pages`)
- Page-specific styles.
- Layout combinations and special cases.

## Best Practices

### Variable Usage

```scss
// DON'T: Use hard-coded values
.element {
  font-size: 16px;
  color: #000000;
}

// DO: Use design tokens
.element {
  font-size: f.font-size('base');
  color: f.color('ink', 'base');
}
```

### Component Structure

```scss
// Component structure template
.component {
  // 1. Layout properties
  // 2. Box model
  // 3. Visual properties
  // 4. Typography
  // 5. Interactive states
  
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
```

### Poetry-Specific Patterns

```scss
// Use poetry mixins for verse content
.verse {
  @include mix.poetry-text;
  @include mix.verse-layout;
  
  &--immortal {
    @include mix.literary-distinction('immortal');
  }
}
```

### Responsive Design

```scss
// Use breakpoint mixins
.element {
  @include mix.breakpoint('md') {
    // Tablet and up styles
  }
  
  @include mix.breakpoint('lg') {
    // Desktop styles
  }
}
```

## Function Reference

### Typography
- `f.font-size($size)`: Get size from type scale.
- `f.line-height($height)`: Get line height value.
- `f.font($family)`: Get font stack.

### Colors
- `f.color($palette, $tone)`: Get color from palette.
- `f.semantic-color($name)`: Get semantic color.
- `f.color-alpha($color, $alpha)`: Add transparency.

### Spacing
- `f.spacing($size)`: Get spacing value.
- `f.rel-spacing($multiplier)`: Get relative spacing.

## Mixin Reference

### Layout
- `mix.container($size)`: Container wrapper.
- `mix.flex($direction, $justify, $align)`: Flexbox setup.
- `mix.grid($columns, $gap)`: Grid setup.

### Typography
- `mix.font-style($size, $weight, $height)`: Complete type styles.
- `mix.poetry-text($size)`: Poetry-specific typography.

### Interactive
- `mix.elevation($level)`: Shadow and hover states.
- `mix.focus-ring`: Accessible focus styles.

## Performance Guidelines

1. Use `@extend` sparingly.
2. Minimize nesting (max 3 levels).
3. Leverage CSS Grid for layouts.
4. Use utility classes for common patterns.

## Adding New Components

1. Create component file in `/components`.
2. Import foundation and mixins.
3. Follow BEM naming convention.
4. Document component usage.
5. Add responsive variations.

## Deployment

1. Ensure no hard-coded values.
2. Check responsive behavior.
3. Validate accessibility.
4. Test print styles.

## Maintenance

1. Regular audit of unused styles.
2. Update documentation.
3. Check browser compatibility.
4. Monitor performance.