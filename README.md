# Apache Zeppelin

**Documentation:** [User Guide](http://zeppelin.apache.org/docs/latest/index.html)<br/>
**Mailing Lists:** [User and Dev mailing list](http://zeppelin.apache.org/community.html)<br/>
**Continuous Integration:** [![Build Status](https://travis-ci.org/apache/zeppelin.svg?branch=master)](https://travis-ci.org/apache/zeppelin) <br/>
**Contributing:** [Contribution Guide](https://zeppelin.apache.org/contribution/contributions.html)<br/>
**Issue Tracker:** [Jira](https://issues.apache.org/jira/browse/ZEPPELIN)<br/>
**License:** [Apache 2.0](https://github.com/apache/zeppelin/blob/master/LICENSE)


**Zeppelin**, a web-based notebook that enables interactive data analytics. You can make beautiful data-driven, interactive and collaborative documents with SQL, Scala and more.

Core feature:
   * Web based notebook style editor.
   * Built-in Apache Spark support


To know more about Zeppelin, visit our web site [http://zeppelin.apache.org](http://zeppelin.apache.org)


## Getting Started

### Install binary package
Please go to [install](http://zeppelin.apache.org/docs/snapshot/install/install.html) to install Apache Zeppelin from binary package.

### Build from source
Please check [Build from source](http://zeppelin.apache.org/docs/snapshot/install/build.html) to build Zeppelin from source.

### Fast build

#### 1. Make sure you have theses packages installed :

* libfontconfig
* git (git -version)
* npm (npm -version)
* openjdk-7-jdk (java -version)

otherwise you may just install these by executing the following commands :

    sudo apt-get update
    sudo apt-get install git openjdk-8-jdk npm libfontconfig maven -y 

#### 2. Make sure you have maven

Maven is a packages repository, a simple way to install is to do the following :  

    export MAVEN_OPTS="-Xmx2g -XX:MaxPermSize=1024m"

#### 3. Clone and build zeppelin !


    git clone https://github.com/raysteam/zeppelin
    cd zeppelin
    mvn clean package -DskipTests

#### 4. Launch zeppelin using this command


    ./bin/zeppelin-daemon.sh start
