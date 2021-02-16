export class DockerUtils {
    /** Environment param keys */
    private static readonly ENV_KEY_HOST = 'JPAAS_HOST';
    private static readonly ENV_KEY_PORT = 'JPAAS_HTTP_PORT';
    private static readonly ENV_KEY_PORT_ORIGINAL = 'JPAAS_HOST_PORT_8080';

    /** Docker host & port */
    private static DOCKER_HOST = '';
    private static DOCKER_PORT = '';

    /** Whether is docker */
    private static IS_DOCKER: boolean;

    /**
     * Retrieve docker host
     *
     * @return empty string if not a docker
     */
    public static getDockerHost() {
        return DockerUtils.DOCKER_HOST;
    }

    /**
     * Retrieve docker port
     *
     * @return empty string if not a docker
     */
    public static getDockerPort() {
        return DockerUtils.DOCKER_PORT;
    }

    /**
     * Whether a docker
     *
     * @return
     */
    public static isDocker() {
        return DockerUtils.IS_DOCKER;
    }

    /**
     * Retrieve host & port from environment
     */
    static retrieveFromEnv = (() => {
        // retrieve host & port from environment
        DockerUtils.DOCKER_HOST = process.env[DockerUtils.ENV_KEY_HOST];
        DockerUtils.DOCKER_PORT = process.env[DockerUtils.ENV_KEY_PORT];

        // not found from 'JPAAS_HTTP_PORT', then try to find from 'JPAAS_HOST_PORT_8080'
        if (!!DockerUtils.DOCKER_PORT) {
            DockerUtils.DOCKER_PORT = process.env[DockerUtils.ENV_KEY_PORT_ORIGINAL];
        }

        const hasEnvHost = !!DockerUtils.DOCKER_HOST;
        const hasEnvPort = !!DockerUtils.DOCKER_PORT;

        // docker can find both host & port from environment
        if (hasEnvHost && hasEnvPort) DockerUtils.IS_DOCKER = true;
        // found nothing means not a docker, maybe an actual machine
        else if (!hasEnvHost && !hasEnvPort) DockerUtils.IS_DOCKER = false;
        else {
            console.error(
                `Missing host or port from env for Docker. host: ${DockerUtils.DOCKER_HOST}, port: ${DockerUtils.DOCKER_PORT}`,
            );
            throw new Error(
                'Missing host or port from env for Docker. host:' +
                    DockerUtils.DOCKER_HOST +
                    ', port:' +
                    DockerUtils.DOCKER_PORT,
            );
        }
    })();
}
