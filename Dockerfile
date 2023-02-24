FROM nginx:alpine

# on the CI build , ther build artifacts are copied on dist-spa folder
COPY dist-spa/ /usr/share/nginx/html/

EXPOSE 80



