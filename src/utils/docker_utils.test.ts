import { DockerUtils } from './docker_utils';

describe('DockerUtils', () => {
    test('isDocker', () => {
        expect(typeof DockerUtils.isDocker() === 'boolean').toBeTruthy();
    });

    test('getDockerHost', () => {
        expect(DockerUtils.getDockerHost()).not.toBeTruthy();
    });

    test('getDockerPort', () => {
        expect(DockerUtils.getDockerPort()).not.toBeTruthy();
    });
});
