/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "olesinski-portfolio.s3.amazonaws.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "olesinski-portfolio.s3.us-east-1.amazonaws.com",
				pathname: "/**",
			},
		],
		loader: "default",
	},
};

export default nextConfig;
