#!/usr/bin/env bash
# Deploy BlueRoute (cs-route.com) to AWS S3 + CloudFront
# Usage: ./deploy.sh

set -euo pipefail

# --- Config ---------------------------------------------------------------
BUCKET="cs-route-com"
DISTRIBUTION_ID="E4YGMP13UPFT0"
REGION="us-east-1"
# --------------------------------------------------------------------------

# Always run from the directory this script lives in
cd "$(dirname "$0")"

echo "==> 1/3  Building production bundle..."
npm run build

echo "==> 2/3  Syncing dist/ to s3://$BUCKET ..."
# Long cache for hashed assets (Vite fingerprints filenames), no cache for index.html
aws s3 sync dist/ "s3://$BUCKET" \
  --region "$REGION" \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --region "$REGION" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

echo "==> 3/3  Invalidating CloudFront cache (distribution $DISTRIBUTION_ID)..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text)

echo ""
echo "Deploy complete."
echo "  Bucket:       s3://$BUCKET"
echo "  Distribution: $DISTRIBUTION_ID"
echo "  Invalidation: $INVALIDATION_ID  (takes ~1-5 min to propagate)"
echo "  Live at:      https://cs-route.com"
