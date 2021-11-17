import { concurrent, delay, toAsync, zipWithIndex } from "../../src/index";

describe("zipWithIndex", () => {
  describe("sync", () => {
    it("should be returned as a tuple ([index,value])", () => {
      const items = ["a", "b", "c", "d"];
      const res = zipWithIndex(items);
      let i = -1;
      for (const item of res) {
        i++;
        expect(item[0]).toEqual(i);
        expect(item[1]).toEqual(items[i]);
      }
    });
  });

  describe("async", () => {
    it("should be returned as a tuple ([index,value])", async () => {
      const items = ["a", "b", "c", "d"];
      const res = zipWithIndex(toAsync(items));
      let i = -1;
      for await (const item of res) {
        i++;
        expect(item[0]).toEqual(i);
        expect(item[1]).toEqual(items[i]);
      }
    });

    it("should be returned as a tuple ([index,value]) concurrently", async () => {
      const items = ["a", "b", "c", "d"];
      const { length } = items;
      const iter = concurrent(
        4,
        zipWithIndex(
          toAsync(items.map((item, i) => delay((length - i) * 100, item))),
        ),
      );

      const {value: [i1, v1]} = await iter.next(); // prettier-ignore
      const {value: [i2, v2]} = await iter.next(); // prettier-ignore
      const {value: [i3, v3]} = await iter.next(); // prettier-ignore
      const {value: [i4, v4]} = await iter.next(); // prettier-ignore
      expect(v1 + v2 + v3 + v4).toEqual("abcd");
      expect([i1, i2, i3, i4]).toEqual([0, 1, 2, 3]);
    });
  });
});
