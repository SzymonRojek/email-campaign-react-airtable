import { axiosInstance } from "../controllers/axiosInstance";
import { getAllRecords } from "../helpers/getAllRecords";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: { get: jest.fn() },
}));

const mockedGet = axiosInstance.get as jest.Mock;

describe("getAllRecords", () => {
  afterEach(() => mockedGet.mockReset());

  it("follows the Airtable offset until all pages are fetched", async () => {
    mockedGet
      .mockResolvedValueOnce({ data: { records: [{ id: "1" }], offset: "p2" } })
      .mockResolvedValueOnce({ data: { records: [{ id: "2" }], offset: "p3" } })
      .mockResolvedValueOnce({ data: { records: [{ id: "3" }] } });

    const records = await getAllRecords("/subscribers");

    expect(records.map((record) => record.id)).toEqual(["1", "2", "3"]);
    expect(mockedGet).toHaveBeenCalledTimes(3);
    expect(mockedGet).toHaveBeenNthCalledWith(2, "/subscribers", {
      params: { offset: "p2" },
    });
  });
});
