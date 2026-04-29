import { UAParser } from "ua-parser-js";
import { getClientIp } from "get-client-ip";
import Session from "../models/session.model.js";
import { hashToken } from "../utils/utils.js";

const createSession = async ({ userId, req, res, refreshToken }) => {
  const sessions = await Session.find({ userId, isValid: true }).lean();

  const now = new Date();

  const activeSessions = sessions.filter((s) => s.expiresAt > now);

  if (activeSessions.length >= 3) {
    const oldest = activeSessions.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    )[0];

    await Session.updateOne({ _id: oldest._id }, { isValid: false });
  }

  const parser = new UAParser(req.headers["user-agent"]);
  const device = parser.getResult();
  const ip = getClientIp(req);

  return Session.insertOne({
    userId,
    refreshToken: hashToken(refreshToken),
    device,
    ip,
    isValid: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export { createSession };
