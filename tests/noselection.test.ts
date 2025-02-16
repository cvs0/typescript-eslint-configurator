import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { main } from "../src/index";

jest.mock("inquirer");
jest.mock("fs");

const mockedInquirer = inquirer as jest.Mocked<typeof inquirer>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe("Tests what happens with empty input", () => {
  it("should handle case when no rules are selected", async () => {
    mockedInquirer.prompt.mockResolvedValueOnce({
      enabledRules: [],
    });

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith("No rules selected.");
    expect(mockedFs.writeFileSync).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
