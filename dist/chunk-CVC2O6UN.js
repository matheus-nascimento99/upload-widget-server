// src/app/functions/errors/invalid-file-format.ts
var InvalidFileFormatError = class extends Error {
  constructor() {
    super("Invalid file format.");
  }
};

export {
  InvalidFileFormatError
};
