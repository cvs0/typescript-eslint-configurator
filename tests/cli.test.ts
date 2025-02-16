import {main} from '../src/index';

jest.mock('inquirer');

describe('CLI Execution', () => {
  it(
    'should run the CLI and return output',
    async () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

        await main()

        expect(consoleLogSpy).toHaveBeenCalledWith("Welcome to the ESLint Configurator!");

        consoleLogSpy.mockRestore();
    }
  );
});
