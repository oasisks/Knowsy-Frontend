import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.GOOGLE_API": JSON.stringify(env.GOOGLE_API),
    },
    plugins: [vue()],
    base: "/",
    resolve: {
      alias: {
        "@": join(__dirname, "client"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
    },
  };
});

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   base: "/",
//   resolve: {
//     alias: {
//       "@": join(__dirname, "client"),
//     },
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//       },
//     },
//   },
//   optimizeDeps: {
//     include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
//   },
// });
