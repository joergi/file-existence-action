import {checkExistence} from "./main";
import {expect} from "chai";

describe('call checkExistence', function() {

        it('should return true for existing file', async function () {
            const res = await checkExistence("src/test/resource/TestFolder/test.txt", false);
            expect(res).to.equal(true);
        });

        it('should return false for uppercase file', async function () {
        const res = await checkExistence("src/test/resource/TestFolder/TEST.txt", false);
        expect(res).to.equal(false);
        });

        it('should return true for uppercase file with ignoreCase true', async function () {
            const res = await checkExistence("src/test/resource/TestFolder/TEST.txt", true);
            expect(res).to.equal(true);
        });

        it('should return true for mIxEd case file with ignoreCase true', async function () {
            const res = await checkExistence("src/test/resource/TestFolder/TeSt.txt", true);
            expect(res).to.equal(true);
        });

});

afterAll(done => {
    done()
})
