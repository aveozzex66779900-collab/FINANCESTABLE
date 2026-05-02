// 🔴 REDIS DISABLED (TYPE-SAFE STUB)

const redis = {
  get: async (_key: string) => null,

  set: async (
    _key: string,
    _value: any,
    _mode?: string,
    _duration?: number
  ) => null,

  del: async (_key: string) => null
};

export default redis;