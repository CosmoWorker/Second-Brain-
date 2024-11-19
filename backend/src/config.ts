type config={
    PORT: number;
    DB_URL: string;
    SECRET_KEY: string;
}

const config: config={
    PORT: 3000,
    DB_URL: "mongodb+srv://admin:0123@vt-cluster.kw8dq.mongodb.net/",
    SECRET_KEY: "2brain!"
}

export default config;