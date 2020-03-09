FROM openjdk:8u242-jre

ADD ./rat-0.13.jar /rat-0.13.jar

# install node
RUN wget https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz && \
  xz -d node-v12.16.1-linux-x64.tar.xz && \
  tar xvf node-v12.16.1-linux-x64.tar && \
  mv node-v12.16.1-linux-x64 /usr/local/
ENV NODE_HOME=/usr/local/node-v12.16.1-linux-x64
ENV PATH=$NODE_HOME/bin:$PATH

# install open-license-check
RUN npm i -g open-license-check

RUN mkdir /github/workspace
ENV WORK_DIR /github/workspace
RUN mkdir /workdir

CMD ["open-license-check"]