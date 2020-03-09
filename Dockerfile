FROM openjdk:8u242-jre

ADD ./rat-0.13.jar /rat-0.13.jar

# install node
RUN wget https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz && \
  xz -d node-v12.16.1-linux-x64.tar.xz && \
  tar xvf node-v12.16.1-linux-x64.tar && \
  mv node-v12.16.1-linux-x64 /usr/local/
ENV NODE_HOME=/usr/local/node-v12.16.1-linux-x64
ENV PATH=$NODE_HOME/bin:$PATH

# copy project
RUN mkdir /open-license-check
ADD ./ /open-license-check
RUN cd /open-license-check && npm i && npm i -g tslib && npm run build

# user project mount path
RUN mkdir -p /github/workspace
WORKDIR /github/workspace

# actual check path
RUN mkdir /check
ENV WORK_DIR /check
ENV RAT_DIR /open-license-check/rat-0.13.jar

RUN chmod +x /open-license-check/entrypoint.sh
ENTRYPOINT ["/open-license-check/entrypoint.sh"]
