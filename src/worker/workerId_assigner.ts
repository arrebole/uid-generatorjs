/**
 * Represents a worker id assigner for {@link impl.DefaultUidGenerator}
 *
 */
export interface WorkerIdAssigner {
    /**
     * Assign worker id for {@link impl.DefaultUidGenerator}
     *
     * @return assigned worker id
     */
    assignWorkerId(): Promise<number>;
}
