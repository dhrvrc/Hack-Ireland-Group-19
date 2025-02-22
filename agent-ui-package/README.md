# Agent UI Package

This package provides the `withAgentControl` Higher Order Component (HOC) for making UI components AI-interactable.

## Installation

```bash
npm install agent-ui-package
```

## Usage

```typescript
import { withAgentControl } from "agent-ui-package";

const MyComponent = withAgentControl((props) => {
  return <button {...props}>Click Me</button>;
});
