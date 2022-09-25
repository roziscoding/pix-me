# pix-me

Create PIX codes to use via QRCode or Pix-Copy-Paste

## Installation

```sh
npm i pix-me
```

## Usage

```typescript
import { pix } from "pix-me";

console.log(pix({
  key: "26385709906",
  city: "Cidade",
  name: "FULANO DE TAL",
}));

// 00020126330014br.gov.bcb.pix0111263857099065204000053039865802BR5913FULANO DE TAL6006Cidade62070503***6304151C
```

See tests for more examples