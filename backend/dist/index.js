"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const socket_1 = require("./config/socket");
const character_routes_1 = __importDefault(require("./routes/character.routes"));
const dungeon_routes_1 = __importDefault(require("./routes/dungeon.routes"));
const combat_routes_1 = __importDefault(require("./routes/combat.routes"));
const marketplace_routes_1 = __importDefault(require("./routes/marketplace.routes"));
const quest_routes_1 = __importDefault(require("./routes/quest.routes"));
const guild_routes_1 = __importDefault(require("./routes/guild.routes"));
const pvp_routes_1 = __importDefault(require("./routes/pvp.routes"));
const gacha_routes_1 = __importDefault(require("./routes/gacha.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/characters', character_routes_1.default);
app.use('/api/dungeon', dungeon_routes_1.default);
app.use('/api/combat', combat_routes_1.default);
app.use('/api/marketplace', marketplace_routes_1.default);
app.use('/api/quests', quest_routes_1.default);
app.use('/api/guilds', guild_routes_1.default);
app.use('/api/pvp', pvp_routes_1.default);
app.use('/api/gacha', gacha_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Aeloria API is running' });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Aeloria Backend running on port ${PORT}`);
        });
        // Setup Socket.IO for real-time features
        (0, socket_1.setupSocketIO)(server);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map