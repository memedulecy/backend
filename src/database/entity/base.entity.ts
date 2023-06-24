import { BeforeSoftRemove, BeforeUpdate, Column, DeleteDateColumn } from 'typeorm';

export class BaseEntity {
    @Column({ nullable: false, comment: '생성한 사람' })
    creator: string = '';

    @Column({ nullable: false, comment: '수정한 사람' })
    updater: string = '';

    @Column({ nullable: false, comment: '생성 시간 ( unix timestamp )' })
    createdTs: number = Date.now();

    @Column({ nullable: false, comment: '수정 시간 ( unix timestamp )' })
    updatedTs: number = Date.now();

    @Column({ nullable: true, comment: '삭제 시간 ( unix timestamp )' })
    deletedTs: number;

    @DeleteDateColumn({ type: 'timestamp', comment: '삭제시간' })
    deletedAt: Date;

    @BeforeUpdate()
    private setUpdatedTs = () => (this.updatedTs = Date.now());

    @BeforeSoftRemove()
    private setDeletedTs = () => (this.deletedTs = Date.now());
}
