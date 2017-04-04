-- 이미지첨부파일
ALTER TABLE `fileattach`
	DROP FOREIGN KEY `FK_board_TO_fileattach`; -- 게시물 -> 이미지첨부파일

-- 이미지첨부파일
ALTER TABLE `fileattach`
	DROP PRIMARY KEY; -- 이미지첨부파일 기본키

-- 게시물
ALTER TABLE `board`
	DROP PRIMARY KEY; -- 게시물 기본키

-- 이미지첨부파일
DROP TABLE IF EXISTS `fileattach` RESTRICT;

-- 게시물
DROP TABLE IF EXISTS `board` RESTRICT;

-- 이미지첨부파일
CREATE TABLE `fileattach` (
	`fno`      INTEGER      NOT NULL COMMENT '첨부파일일련번호', -- 첨부파일일련번호
	`dest_dir` VARCHAR(255) NOT NULL COMMENT '저장된파일경로', -- 저장된파일경로
	`bno`      INTEGER      NOT NULL COMMENT '게시글일련번호' -- 게시글일련번호
)
COMMENT '이미지첨부파일';

-- 이미지첨부파일
ALTER TABLE `fileattach`
	ADD CONSTRAINT `PK_fileattach` -- 이미지첨부파일 기본키
		PRIMARY KEY (
			`fno` -- 첨부파일일련번호
		);

ALTER TABLE `fileattach`
	MODIFY COLUMN `fno` INTEGER NOT NULL AUTO_INCREMENT COMMENT '첨부파일일련번호';

-- 게시물
CREATE TABLE `board` (
	`bno`      INTEGER      NOT NULL COMMENT '게시글일련번호', -- 게시글일련번호
	`category` VARCHAR(255) NOT NULL COMMENT '카테고리', -- 카테고리
	`title`    VARCHAR(255) NOT NULL COMMENT '제목', -- 제목
	`content`  TEXT         NOT NULL COMMENT '내용' -- 내용
)
COMMENT '게시물';

-- 게시물
ALTER TABLE `board`
	ADD CONSTRAINT `PK_board` -- 게시물 기본키
		PRIMARY KEY (
			`bno` -- 게시글일련번호
		);

ALTER TABLE `board`
	MODIFY COLUMN `bno` INTEGER NOT NULL AUTO_INCREMENT COMMENT '게시글일련번호';

-- 이미지첨부파일
ALTER TABLE `fileattach`
	ADD CONSTRAINT `FK_board_TO_fileattach` -- 게시물 -> 이미지첨부파일
		FOREIGN KEY (
			`bno` -- 게시글일련번호
		)
		REFERENCES `board` ( -- 게시물
			`bno` -- 게시글일련번호
		);
