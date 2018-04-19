# Chaos

> Chaos is a ladder.

We will explore basic fault and event injection to understand how a simple service responds to different events. To faciliate this workshop, we will run a service in a single docker container, so we have better ability to control resources.

This workshop will be a bit more exploratory than some of our other workshops, so this will be a good chance to practice using Docker.

### Setup

We will need to build the Dockerfile to setup up the environment with our chaos tools and scripts.

1. Build the Dockerfile and tag it chaos-workshop.
2. Run a container and explore the contents.
3. Start a new container and run the cat facts server.

   docker run --cap-add=NET_ADMIN -p 3000:3000 --name cats -d chaos-workshop node main.js

### Tools of Chaos

Inside the /chaos directory, we will find several

Many of the scripts use traffic control, an advancd tool for setting networking policy. For example, running this will corrupt 50% of packages.

    tc qdisc add dev eth0 root netem corrupt 50%

1. Use `docker exec` to create a bash command to connect to running service. 
2. Execute scripts in /chaos.
3. Observe and note any effect on the running service.
4. Gather some simple timing measures (can use: `time curl localhost:3000/catfacts/101`).

### Squeeze Testing

By default a Docker container allocates unlimited cpu and memory. Try limiting the available cpu and memory settings with running the container. You can use these parameters:

```
--cpus=".5"
-m 8m
Most of these options take a positive integer, followed by a suffix of b, k, m, g, to indicate bytes, kilobytes, megabytes, or gigabytes.
```

### Reflection

How could you extend this workshop to collect more measures and devise an automated experiment to understand which event/failure causes the most problems?