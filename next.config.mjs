/** @type {import('next').NextConfig} */
import path from 'path';


const nextConfig = {
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname, './src');
      config.resolve.alias['@/lib/utils'] = path.resolve(__dirname, './src/lib/utils');
      return config;
    },
  };
export default nextConfig;
