# VerseCraft Design System

A refined, New Yorker-inspired design system for the VerseCraft project. This system combines the structural sophistication of a modern design framework with the artistic elegance of literary-themed visuals.

---

## Architecture Overview

The design system is structured in four primary layers, ensuring modularity, readability, and ease of maintenance.

### 1. Base Layer (`/base`)
- **`_variables.scss`**: The single source of truth for all design tokens, including colors, typography, spacing, and breakpoints.
- **`_foundation.scss`**: Core utility functions and helpers, laying a strong foundation for the system.
- **`_mixins.scss`**: Reusable style patterns to apply consistent styling across components.
- **`_reset.scss`**: Baseline style reset that removes default browser styling, ensuring consistency.
- **`_typography.scss`**: Typography implementation, using a custom typographic hierarchy that enhances readability.
- **`_utilities.scss`**: Utility classes for common styling patterns, enabling rapid and consistent styling.

### 2. Layout Layer (`/layout`)
- Defines core layout patterns, grid systems, and responsive behaviors. Styled to emulate the layout principles of Instagram but with the sophistication expected of a literary publication.

### 3. Components Layer (`/components`)
- Contains individual UI components, each following the BEM (Block Element Modifier) methodology for organized, self-contained styles.

### 4. Pages Layer (`/pages`)
- Contains page-specific styles, special cases, and layout combinations to cater to specific page requirements within the VerseCraft project.

---

## Best Practices and Guidelines

### Variable Usage
Always use design tokens for colors, typography, and spacing to maintain consistency and scalability.

```scss
// Avoid hard-coded values
.element {
  font-size: 16px;
  color: #000000;
}

// Use design tokens instead
.element {
  font-size: f.font-size('base');
  color: f.color('ink', 'base');
}
```

### Component Structure

```scss
// BEM structure for components
.component {
  // 1. Layout properties
  // 2. Box model
  // 3. Visual properties
  // 4. Typography
  // 5. Interactive states
  
  &__element {
    // Element-specific styles
  }
  
  &--modifier {
    // Modifier-specific styles
  }
}
```

### Poetry-Specific Patterns
Specialized patterns are created for the unique literary content in VerseCraft, especially for poetry and verse styling.

```scss
// Verse styling
.verse {
  @include mix.poetry-text;
  @include mix.verse-layout;
  
  &--immortal {
    @include mix.literary-distinction('immortal');
  }
}
```

### Responsive Design
Leverage the system’s responsive breakpoints to create layouts that work across devices.

```scss
// Breakpoint usage
.element {
  @include mix.breakpoint('md') {
    // Tablet styles
  }
  
  @include mix.breakpoint('lg') {
    // Desktop styles
  }
}
```

---

## Design Tokens and Functions

### Typography
- **`f.font-size($size)`**: Retrieves font size from the type scale.
- **`f.line-height($height)`**: Retrieves line height value.
- **`f.font($family)`**: Retrieves font stack for specified font family.

### Colors
- **`f.color($palette, $tone)`**: Retrieves color from specified palette and tone.
- **`f.semantic-color($name)`**: Retrieves semantic color.
- **`f.color-alpha($color, $alpha)`**: Adds transparency to a color.

### Spacing
- **`f.spacing($size)`**: Retrieves spacing value.
- **`f.rel-spacing($multiplier)`**: Retrieves relative spacing based on a multiplier.

---

## Mixin Reference

### Layout
- **`mix.container($size)`**: Applies container styling for specific size.
- **`mix.flex($direction, $justify, $align)`**: Sets up a flexible layout with specified alignment.
- **`mix.grid($columns, $gap)`**: Establishes grid layout with set columns and gap.

### Typography
- **`mix.font-style($size, $weight, $height)`**: Applies a complete set of typography styles.
- **`mix.poetry-text($size)`**: Sets typography for poetry and verse sections.

### Interactive
- **`mix.elevation($level)`**: Applies shadow and hover states based on elevation level.
- **`mix.focus-ring`**: Styles for accessible focus states.

---

## Performance and Accessibility Guidelines

1. Use `@extend` sparingly to avoid unintended style inheritance.
2. Limit nesting to a maximum of 3 levels to improve readability and performance.
3. Leverage CSS Grid for layouts when applicable.
4. Use utility classes for commonly repeated patterns to minimize CSS redundancy.

---

## Adding New Components

1. **Create Component**: Start by creating a new SCSS file within `/components`.
2. **Import Foundation and Mixins**: Import necessary mixins and variables.
3. **Follow BEM Naming Convention**: Ensure styles are organized for easy modification and reuse.
4. **Document Usage**: Provide clear documentation within the file.
5. **Responsive Variations**: Add styles for responsive breakpoints as necessary.

---

## Deployment Checklist

1. Verify there are no hard-coded values; all should reference design tokens.
2. Test responsive behavior across multiple devices.
3. Validate accessibility with focus on contrast and keyboard navigation.
4. Ensure print styles are formatted and accessible.

---

## Maintenance and Updates

1. **Regular Audits**: Identify and remove any unused styles.
2. **Documentation**: Keep the documentation up to date as the design system evolves.
3. **Compatibility Checks**: Ensure compatibility across supported browsers.
4. **Performance Monitoring**: Regularly assess the impact on page load and responsiveness.