var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var Pool = require("pg").Pool;
var client = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: "postgres",
    password: process.env.DB_PASS || "postgres",
    port: 5432
});
var addData = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.query("DELETE from event_Information")];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('1', 'Intro to Java', 'blue', 'Class', false)")];
            case 2:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('2', 'Intro to Python', 'green', 'Class', true)")];
            case 3:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('3', 'Advanced Java', 'green', 'Class', true)")];
            case 4:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('4', 'Advanced Java', 'green', 'Class', true)")];
            case 5:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('5', 'Advanced Java', 'green', 'Class', true)")];
            case 6:
                _a.sent();
                return [4 /*yield*/, client.query("DELETE from classes")];
            case 7:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES('1', 4, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english', '{John, Bill, Carl}')")];
            case 8:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES('2', 1, 2, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=TU,TH;INTERVAL=1', '06:15Z', '08:15Z', 'english', '{John, Bill, Carl}')")];
            case 9:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES('3', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english', '{John, Bill, Carl}')")];
            case 10:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES('4', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english', '{John, Bill, Carl}')")];
            case 11:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES('5', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english', '{John, Bill, Carl}')")];
            case 12:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('77', 'John', 'Test', 'john@gmail.com', 'Teacher', '123 nowhere lane', '123-456-7890')")];
            case 13:
                _a.sent();
                return [4 /*yield*/, client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('77', '5')")];
            case 14:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
addData().then(function () { return process.exit(); });
