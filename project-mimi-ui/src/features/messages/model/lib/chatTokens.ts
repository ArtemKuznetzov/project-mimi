export const chatTokens = {
  chatSurface: {
    light: "#EFEAE2",
    dark: "#0B141A",
  },

  messageBubble: {
    light: {
      mine: { bg: "#D9FDD3" },
      yours: { bg: "#FFFFFF" },
      deleted: { bg: "#E5E7EB", bgDark: "#374151" },
    },
    dark: {
      mine: { bg: "#005C4B" },
      yours: { bg: "#1F2C33" },
    },
  },

  text: {
    primary: {
      light: "#111B21",
      dark: "#E9EDEF",
    },
    secondary: {
      light: "#111B21",
      dark: "#E9EDEF",
    },
    deleted: {
      light: "#6B7280",
      dark: "#D1D5DB",
    },
  },

  border: {
    outgoing: {
      light: "#06CF9C",
      dark: "#00A884",
    },
    incoming: {
      light: "#3390EC",
      dark: "#3390EC",
    },
  },

  replyBg: {
    my: { light: "rgba(0,0,0,0.04)", dark: "rgba(255,255,255,0.06)" },
    your: { light: "#F0F2F5", dark: "rgba(255,255,255,0.05)" },
  },

  readReceipt: "#53BDEB",
  mediaPlaceholder: {
    light: "#E4E4E4",
    dark: "#2A3942",
  },

  ring: {
    message: { light: "rgba(0,0,0,0.04)", dark: "rgba(255,255,255,0.06)" },
    input: { light: "rgba(0,0,0,0.06)", dark: "rgba(255,255,255,0.06)" },
  },
} as const;
