//styled
import { useState } from 'react';
import {
  Subject,
  SubjectNameInList,
  Detail,
  P,
  CloseBtn,
  TooltipContainer,
  TimeText,
} from './SubjectCard.element.js';
import { Tag, TagContainer } from '../Card/Card.element';
import Tooltip from '@material-ui/core/Tooltip';

const SubjectCard = ({ subject, onClick, active, onDelete, latest }) => {
  return (
    <Subject onClick={() => (active ? onClick(subject.subject_id) : null)}>
      <SubjectNameInList font={14}>
        {subject.과목명}{' '}
        {/* {subject.subject_id.substring(13, 14) === '0' ? ( // 01?
          <span style={{ fontSize: '13px' }}>
            [{subject.subject_id.substring(14, 15)}반]
          </span>
        ) : (
          // 10?
          <span style={{ fontSize: '13px' }}>
            [{subject.subject_id.substring(13, 15)}반]
          </span>
        )} */}
      </SubjectNameInList>
      <TagContainer>
        {subject.대면여부 === '비대면' ? <Tag untact>비대면</Tag> : null}
        {subject.대면여부 === '대면' ? <Tag ontact>대면</Tag> : null}
        <Tag credit={subject.학점}>{subject.학점}학점</Tag>
        {subject.강의언어 === '영어' ? <Tag eng>영어강의</Tag> : null}
        {subject.강의언어 === '중국어' ? <Tag china>중국어강의</Tag> : null}
      </TagContainer>
      <Detail>
        <P text={subject.교수진}>{subject.교수진}</P>
        {subject.요일1 === subject.요일2 ? (
          <TimeText>
            {subject.요일1} {subject.시간1}
          </TimeText>
        ) : null}
        {subject.요일1 !== subject.요일2 ? (
          <>
            {subject.시간1 === subject.시간2 ? (
              <TimeText>
                {subject.요일1},{subject.요일2} {subject.시간1}
              </TimeText>
            ) : (
              <TimeText>
                {subject.요일1} {subject.시간1} ,{subject.요일2} {subject.시간2}
              </TimeText>
            )}
          </>
        ) : null}
      </Detail>
      {onDelete && (
        <Tooltip title="삭제" placement="bottom">
          <TooltipContainer>
            <CloseBtn
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, subject.subject_id, latest);
              }}
            ></CloseBtn>
          </TooltipContainer>
        </Tooltip>
      )}
    </Subject>
  );
};

export default SubjectCard;
