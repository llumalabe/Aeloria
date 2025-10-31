"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aeloria';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB Connected');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB error:', error);
});
//# sourceMappingURL=database.js.map