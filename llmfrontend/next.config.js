/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV === 'development';

const nextConfig = {
  webpack: (config, options) => {
    if (!options.isServer) {
      config.experiments = {
        topLevelAwait: true
      };
    }

    return config;
  },
  reactStrictMode: true,
  // experimental:
  //   scrollRestoration: true,
  // },
  output: 'standalone',
  // trailingSlash: false,
  env: {
    // General Configuration
    DEV: dev,
    SKA_API_AUTH_TOKEN: process.env.SKA_API_AUTH_TOKEN || "dev-token-change-in-production",
    SITE_URL: process.env.SITE_URL || (dev ? "https://localhost:3000" : "https://resumeguru.io"),
    BLOG_HOST_URL: process.env.BLOG_HOST_URL || "https://blog.resumeguru.io",

    // Google GA4 ID
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXX",
    // Google GTM ID
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXXXX",

    // SEO Config
    SEO_DEFAULT_TITLE: process.env.SEO_DEFAULT_TITLE || "Generate-AI Resume Building | Rewriting the Future | Interview Tools",
    SEO_DEFAULT_DESCRIPTION: process.env.SEO_DEFAULT_DESCRIPTION || "ResumeGuru.IO is a Generative-AI powered resume builder/rewriter/mock interviewer that helps you create a professional resume in minutes. Interview Q&A, Cover Letter and more.",
    SEO_DEFAULT_KEYWORDS: process.env.SEO_DEFAULT_KEYWORDS || "resume,builder,ai,interview,cover letter",
    SEO_DEFAULT_OG_IMAGE: process.env.SEO_DEFAULT_OG_IMAGE || "https://resumeguru.io/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg",

    // Google reCAPTCHA
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || "your-recaptcha-site-key",
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "your-recaptcha-secret-key",
    
    // MongoDB Configuration
    BACKEND_PROVIDER: process.env.BACKEND_PROVIDER || "MongoDB",
    BACKEND_VERSION: process.env.BACKEND_VERSION || "2023-01",
    API_AUTH_BEARER_TOKEN: process.env.API_AUTH_BEARER_TOKEN || "dev-bearer-token-change-in-production",
    MONGODB_SERIVCE_NAME: process.env.MONGODB_SERIVCE_NAME || "mongodb-atlas",
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || (dev ? "ResumeGuruDev" : "ResumeGuru"),
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://your-cluster.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=your-app-name",
    MONGODB_CERTIFICATE_KEY_FILE: process.env.MONGODB_CERTIFICATE_KEY_FILE || "./src/X509-cert-your-cert.pem",
    MONGODB_APOLLO_CLIENT_URL: process.env.MONGODB_APOLLO_CLIENT_URL || "https://us-central1.gcp.services.cloud.mongodb.com/api/client/v2.0/app/your-app-id/graphql",
    REALM_APP_ID: process.env.REALM_APP_ID || (dev ? "resumegurudev-xxxxx" : "resumeguru-xxxxx"),
    REALMAPP_API_KEY: process.env.REALMAPP_API_KEY || "your-realm-api-key",
    
    // OpenAI Configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "sk-your-openai-api-key",
    OPENAI_API_KEY_GPT4: process.env.OPENAI_API_KEY_GPT4 || "sk-your-openai-gpt4-api-key",
    
    // Cloudflare Configuration
    CLOUDFLARE_S3_API_URL_PRIVATE: process.env.CLOUDFLARE_S3_API_URL_PRIVATE || "https://your-bucket.r2.cloudflarestorage.com/your-private-folder",
    CLOUDFLARE_S3_API_URL_PUBLIC: process.env.CLOUDFLARE_S3_API_URL_PUBLIC || "https://your-bucket.r2.cloudflarestorage.com/resumeguru",
    CLOUDFLARE_S3_BUCKET_URL_PUBLIC: process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC || "https://pub-your-bucket.r2.dev",
    CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID || "your-cloudflare-access-key",
    CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "your-cloudflare-secret-key",
    
    // Microsoft Azure Configuration
    MICROSOFT_APP_AUTH_TANANT_ID: process.env.MICROSOFT_APP_AUTH_TANANT_ID || "your-tenant-id",
    MICROSOFT_OPENAI_API_KEY: process.env.MICROSOFT_OPENAI_API_KEY || "your-microsoft-openai-api-key",
    MICROSOFT_OPENAI_API_KEY_GPT4_32K: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K || "your-microsoft-openai-gpt4-32k-api-key",
    MICROSOFT_OPENAI_API_URL_CHAT: process.env.MICROSOFT_OPENAI_API_URL_CHAT || "https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview",
    MICROSOFT_OPENAI_API_URL_CHAT_32K: process.env.MICROSOFT_OPENAI_API_URL_CHAT_32K || "https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview",
    MICROSOFT_OPENAI_API_URL_CHAT_GPT4: process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4 || "https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview",
    MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K: process.env.MICROSOFT_OPENAI_API_URL_CHAT_GPT4_32K || "https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview",
    MICROSOFT_SDK_OPENAI_DEPLOYMENT_ID_GPT4_32K: process.env.MICROSOFT_SDK_OPENAI_DEPLOYMENT_ID_GPT4_32K || "your-deployment-id",
    MICROSOFT_SDK_OPENAI_API_ENDPOINT_GPT4_32K: process.env.MICROSOFT_SDK_OPENAI_API_ENDPOINT_GPT4_32K || "https://your-resource.openai.azure.com/",
    MICROSOFT_SDK_OPENAI_API_KEY_GPT4_32K: process.env.MICROSOFT_SDK_OPENAI_API_KEY_GPT4_32K || "your-sdk-api-key",
    MICROSOFT_DOC_INTELLIGENCE_MODELID: process.env.MICROSOFT_DOC_INTELLIGENCE_MODELID || "linkedin-pdf-v5",
    MICROSOFT_DOC_INTELLIGENCE_KEY: process.env.MICROSOFT_DOC_INTELLIGENCE_KEY || "your-doc-intelligence-key",
    MICROSOFT_DOC_INTELLIGENCE_END_POINT: process.env.MICROSOFT_DOC_INTELLIGENCE_END_POINT || "https://your-resource.cognitiveservices.azure.com",
    azureOpenAIBasePath: process.env.azureOpenAIBasePath || "https://your-resource.openai.azure.com/openai/deployments",
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName || "your-instance-name",
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName || "your-deployment-name",
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion || "2024-02-15-preview",
    
    // Microsoft Speech Configuration
    MS_AZURE_SPEECH_SERVICE_REGION: process.env.MS_AZURE_SPEECH_SERVICE_REGION || "westus2",
    MS_AZURE_SPEECH_SERVICE_KEY: process.env.MS_AZURE_SPEECH_SERVICE_KEY || "your-speech-service-key",
    MS_AZURE_SPEECH_SERVICE_VOICE_NAME: process.env.MS_AZURE_SPEECH_SERVICE_VOICE_NAME || "en-US-JennyMultilingualNeural",
    MS_AZURE_SPEECH_SERVICE_AVATAR: process.env.MS_AZURE_SPEECH_SERVICE_AVATAR || "Lisa",
    MS_AZURE_SPEECH_SERVICE_STYLE: process.env.MS_AZURE_SPEECH_SERVICE_STYLE || "casual-sitting",
    MS_AZURE_SPEECH_SERVICE_BG: process.env.MS_AZURE_SPEECH_SERVICE_BG || "#ffffff",
    
    // Firebase Config
    FIREBASE_PUBLIC_APIKEY: process.env.FIREBASE_PUBLIC_APIKEY || "your-firebase-api-key",
    FIREBASE_PUBLIC_AUTHDOMAIN: process.env.FIREBASE_PUBLIC_AUTHDOMAIN || "your-project.firebaseapp.com",
    FIREBASE_PUBLIC_PROJECTID: process.env.FIREBASE_PUBLIC_PROJECTID || "your-project-id",
    FIREBASE_PUBLIC_STORAGEBUCKET: process.env.FIREBASE_PUBLIC_STORAGEBUCKET || "your-project.appspot.com",
    FIREBASE_PUBLIC_MESSAGINGSENDERID: process.env.FIREBASE_PUBLIC_MESSAGINGSENDERID || "your-sender-id",
    FIREBASE_PUBLIC_APPID: process.env.FIREBASE_PUBLIC_APPID || "1:your-app-id:web:your-web-id",
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || "G-your-measurement-id",

    // Stripe Config
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your-publishable-key",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_your-secret-key",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "whsec_your-webhook-secret",
    STRIPE_WEBHOOK_ID: process.env.STRIPE_WEBHOOK_ID || "we_your-webhook-id",

    // SendGrid Config
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "SG.your-sendgrid-api-key",
    
    // Langchain Config
    LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2 || "true",
    LANGCHAIN_ENDPOINT: process.env.LANGCHAIN_ENDPOINT || "https://api.smith.langchain.com",
    LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY || "your-langchain-api-key",
    LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT || "your-project.io.dev",
    
    // Ghost Blog Config
    GHOST_BLOG_API_URL: process.env.GHOST_BLOG_API_URL || "https://blog.resumeguru.io",
    GHOST_BLOG_API_ADMIN_KEY: process.env.GHOST_BLOG_API_ADMIN_KEY || "your-admin-key:your-admin-secret",
    GHOST_BLOG_API_CONTENT_KEY: process.env.GHOST_BLOG_API_CONTENT_KEY || "your-content-key",

    // RapidAPI
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || "your-rapidapi-key",
    RAPIDAPI_HOST: process.env.RAPIDAPI_HOST || "your-rapidapi-host.rapidapi.com",

    // LLM Backend
    LLM1_BACKEND_WEBSOCKET_URL: process.env.LLM1_BACKEND_WEBSOCKET_URL || (dev ? "ws://localhost:8000/chatMockInterview/" : "wss://your-backend.resumeguru.io/chatMockInterview/"),
    LLM1_BACKEND_WEBSOCKET_AUTH_KEY: process.env.LLM1_BACKEND_WEBSOCKET_AUTH_KEY || "your-websocket-auth-key",

    ENABLE_AVATAR_VIDEO: process.env.ENABLE_AVATAR_VIDEO || "false",

    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://your-strapi.resumeguru.io/api",
    NEXT_PUBLIC_STRAPI_API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "your-strapi-api-token",
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC?.replace('https://', '') || 'pub-your-bucket.r2.dev',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig;

// Injected content via Sentry wizard below
//
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: process.env.SENTRY_ORG || "your-sentry-org",
    project: process.env.SENTRY_PROJECT || "your-sentry-project",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
