"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const checkAuth = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const storedUser = localStorage.getItem('codefusion_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
            catch (error) {
                console.error('Authentication error:', error);
            }
            finally {
                setIsLoading(false);
            }
        });
        checkAuth();
    }, []);
    const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const response = yield fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = yield response.json();
            setUser(data.user);
            localStorage.setItem('codefusion_user', JSON.stringify(data.user));
            localStorage.setItem('codefusion_token', data.token);
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    });
    const signup = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const response = yield fetch('/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            const data = yield response.json();
            setUser(data.user);
            localStorage.setItem('codefusion_user', JSON.stringify(data.user));
            localStorage.setItem('codefusion_token', data.token);
        }
        catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    });
    const logout = () => {
        setUser(null);
        localStorage.removeItem('codefusion_user');
        localStorage.removeItem('codefusion_token');
    };
    const resetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/v1/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error('Password reset failed');
            }
        }
        catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    });
    const updateProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = localStorage.getItem('codefusion_token');
            const response = yield fetch('/api/v1/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Profile update failed');
            }
            const updatedUser = yield response.json();
            setUser(updatedUser);
            localStorage.setItem('codefusion_user', JSON.stringify(updatedUser));
        }
        catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    });
    const updateAvatar = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = localStorage.getItem('codefusion_token');
            const response = yield fetch('/api/v1/avatar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatar: imageUrl }),
            });
            if (!response.ok) {
                throw new Error('Avatar update failed');
            }
            const updatedUser = yield response.json();
            setUser(updatedUser);
            localStorage.setItem('codefusion_user', JSON.stringify(updatedUser));
        }
        catch (error) {
            console.error('Avatar update error:', error);
            throw error;
        }
    });
    const updateSubscription = (plan) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = localStorage.getItem('codefusion_token');
            const response = yield fetch('/api/v1/subscription', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan }),
            });
            if (!response.ok) {
                throw new Error('Subscription update failed');
            }
            const updatedUser = yield response.json();
            setUser(updatedUser);
            localStorage.setItem('codefusion_user', JSON.stringify(updatedUser));
        }
        catch (error) {
            console.error('Subscription update error:', error);
            throw error;
        }
    });
    return (react_1.default.createElement(AuthContext.Provider, { value: {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
            resetPassword,
            updateProfile,
            updateAvatar,
            updateSubscription
        } }, children));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
exports.useAuth = useAuth;
