"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votePollCallable = exports.signPetitionCallable = exports.onReportStatusChanged = exports.onDemandStatusChanged = exports.onDemandCreated = void 0;
var onDemandCreated_1 = require("./onDemandCreated");
Object.defineProperty(exports, "onDemandCreated", { enumerable: true, get: function () { return onDemandCreated_1.onDemandCreated; } });
var onStatusChanged_1 = require("./onStatusChanged");
Object.defineProperty(exports, "onDemandStatusChanged", { enumerable: true, get: function () { return onStatusChanged_1.onDemandStatusChanged; } });
Object.defineProperty(exports, "onReportStatusChanged", { enumerable: true, get: function () { return onStatusChanged_1.onReportStatusChanged; } });
var signPetition_1 = require("./signPetition");
Object.defineProperty(exports, "signPetitionCallable", { enumerable: true, get: function () { return signPetition_1.signPetitionCallable; } });
var votePoll_1 = require("./votePoll");
Object.defineProperty(exports, "votePollCallable", { enumerable: true, get: function () { return votePoll_1.votePollCallable; } });
//# sourceMappingURL=index.js.map