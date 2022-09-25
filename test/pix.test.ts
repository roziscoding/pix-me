import { pix } from "../src/pix.ts";

import { assertEquals } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";

describe("pix", () => {
  describe("generates valid PIX codes for", () => {
    it("non specified amount", () => {
      assertEquals(
        pix({
          key: "26385709906",
          city: "Cidade",
          name: "FULANO DE TAL",
        }),
        "00020126330014br.gov.bcb.pix0111263857099065204000053039865802BR5913FULANO DE TAL6006Cidade62070503***6304151C",
      );
    });

    it("email keys", () => {
      assertEquals(
        pix({
          key: "fulano.de.tal@gmail.com",
          city: "Cidade",
          name: "FULANO DE TAL",
        }),
        "00020126450014br.gov.bcb.pix0123fulano.de.tal@gmail.com5204000053039865802BR5913FULANO DE TAL6006Cidade62070503***63045E63",
      );
    });

    it("random keys", () => {
      assertEquals(
        pix({
          key: "4b7b4eb3-d426-48f1-8ecf-998bda62c0a1",
          city: "Cidade",
          name: "FULANO DE TAL",
        }),
        "00020126580014br.gov.bcb.pix01364b7b4eb3-d426-48f1-8ecf-998bda62c0a15204000053039865802BR5913FULANO DE TAL6006Cidade62070503***6304CAC5",
      );
    });

    it("phone keys", () => {
      assertEquals(
        pix({
          key: "+5568375779606",
          city: "Cidade",
          name: "FULANO DE TAL",
        }),
        "00020126360014br.gov.bcb.pix0114+55683757796065204000053039865802BR5913FULANO DE TAL6006Cidade62070503***630484D0",
      );
    });

    it("cnpj keys", () => {
      ``;
      assertEquals(
        pix({
          key: "20687705000136",
          city: "Cidade",
          name: "FULANO DE TAL",
        }),
        "00020126360014br.gov.bcb.pix0114206877050001365204000053039865802BR5913FULANO DE TAL6006Cidade62070503***630472EB",
      );
    });
  });
});
