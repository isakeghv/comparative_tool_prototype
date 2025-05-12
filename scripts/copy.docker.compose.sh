GITHUB_TOKEN="${GITHUB_TOKEN:-YOUR_FALLBACK_TOKEN}"
OWNER="chriskng" # based on fork
REPO="comparative_tool_prototype"
BRANCH="main"

DEFAULT_WD="/home/group3/comparative_tool_prototype"
WD="${WD:-$DEFAULT_WD}"

download_file() {
  local file_path="$1"
  local output_path="$2"
  
  curl -sSL \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3.raw" \
    "https://api.github.com/repos/${OWNER}/${REPO}/contents/${file_path}?ref=${BRANCH}" \
    -o "${output_path}"
}

download_file "docker-compose.yaml" "${WD}/compose.yaml"