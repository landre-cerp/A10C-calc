FROM nginx:alpine

# on the CI build , ther build artifacts are copied on dist-spa folder
# fixed
COPY dist-pwa/ /usr/share/nginx/html/

EXPOSE 80



