
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-extend-native
BigInt.prototype.toJSON = function toJSON(this: bigint) {
  return this.toString();
};

export {};
