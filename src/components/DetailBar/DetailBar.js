import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

//components
import GradationBtn from '../GradationBtn/GradationBtn';
import Subject from '../SubjectCard/SubjectCard';
import ProfileBar from '../ProfileBar/ProfileBar';
import StarBtn from './StarBtn';

//context
import { useLoadingContext } from '../../contexts/LoadingContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSnackBarContext } from '../../contexts/SnackBarContext';

//styled
import {
  DetailbarComponent,
  DetailbarContent,
  StackContent,
  DetailContainer,
  Top,
  SubjectName,
  BtnContainer,
  SubjectTable,
  TableBody,
  TableRow,
  TableHead,
  TableData,
  OptionBtnContainer,
  SubjectList,
  Divider,
} from './DetailBar.element';
import { Tag, TagContainer } from '../Card/Card.element';

const Spinner = styled(CircularProgress)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1000;
  & svg {
    color: #7945e2;
  }
`;

const DetailBar = ({
  width,
  height,
  openModal,
  subject,
  latestSubject,
  clickCard,
}) => {
  const { isAuth, userData } = useAuthContext();
  const { setSnackBar } = useSnackBarContext();

  //최근 본과목 -> true, 즐겨찾기 -> false
  const [latestAndFavoritesToggle, setLatestAndFavoritesToggle] =
    useState(true);
  const [latestList, setLatestList] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [checkBookmark, setCheckBookmark] = useState(false);

  //해당과목 즐겨찾기 여부, 즐겨찾기 추가, 삭제
  useEffect(() => {
    console.log(favoriteList);
    const existInFavoriteList = favoriteList.find(
      (favorite) => favorite.subject_id === subject.subject_id
    );
    existInFavoriteList ? setCheckBookmark(true) : setCheckBookmark(false);
  }, [subject, favoriteList]);

  useEffect(() => {
    if (isAuth) {
      axios
        .get('/favorites/')
        .then((res) => {
          setFavoriteList(res.data.data);
        })
        .then(() => {});
    }
    return () => {
      if (isAuth) {
        axios
          .post('/favorites/update', {
            sub_id: favoriteList,
          })
          .then((res) => {
            if (res.status === 201) {
              console.log(res);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }, []);

  useEffect(() => {
    if (JSON.stringify(latestSubject) === '{}') {
      return;
    }

    const latestListIndex = latestList.findIndex(
      (latest) => latest.subject_id === latestSubject.subject_id
    );

    if (latestListIndex === -1) {
      // 최근 본 과목 리스트에 없을 때
      const list = latestList.concat(latestSubject);

      if (list > 10) {
        list.shift();
      }

      setLatestList(list);
    } else if (latestListIndex > 0) {
      // 이미 최근 본 과목 리스트에 있을 때
      const list = [...latestList];

      //latestSubject를 맨 앞으로
      list.unshift(list.splice(latestListIndex, 1)[0]);

      setLatestList(list);
    }
  }, [latestSubject]);

  const toFavorite = () => {
    // 즐겨찾기 버튼 눌렀을 때 해당 과목 즐겨찾기 리스트로 이동. 한 번 더 누르면 즐겨찾기 리스트에서 삭제
    const sub = favoriteList.find((favorite) => {
      return favorite === subject;
    });
    let list = [...favoriteList];

    if (sub === undefined) {
      list = favoriteList.concat(subject);

      if (list.length > 10) {
        list.shift();
      }

      setFavoriteList(list);
    } else {
      const idx = favoriteList.indexOf(sub);
      if (idx > -1) list.splice(idx, 1);
      setFavoriteList(list);
    }
  };

  const switchLatestAndFavorites = (e) => {
    if (e.target.innerText === '최근 본 과목' && !latestAndFavoritesToggle) {
      setLatestAndFavoritesToggle(true);
    } else if (e.target.innerText === '즐겨찾기' && latestAndFavoritesToggle) {
      setLatestAndFavoritesToggle(false);
    }
  };

  return (
    <>
      <DetailbarComponent widthPx={width} heightPx={height}>
        <DetailContainer>
          <ProfileBar openModal={openModal} detailbar></ProfileBar>
          <DetailbarContent>
            {JSON.stringify(subject) === '{}' ? (
              ''
            ) : (
              <>
                <Top>
                  <SubjectName font={19}>{subject.과목명}</SubjectName>
                  <BtnContainer>
                    <StarBtn
                      size={22}
                      checkBookmark={checkBookmark}
                      onClick={toFavorite}
                    ></StarBtn>
                  </BtnContainer>
                </Top>
                <TagContainer>
                  {subject.대면여부 ? (
                    <Tag untact fontSize="12">
                      비대면
                    </Tag>
                  ) : (
                    <Tag ontact fontSize="12">
                      대면
                    </Tag>
                  )}
                  {subject.강의언어 === '영어' ? (
                    <Tag eng fontSize="12">
                      영어강의
                    </Tag>
                  ) : null}
                  {subject.강의언어 === '중국어' ? (
                    <Tag china fontSize="12">
                      중국어강의
                    </Tag>
                  ) : null}
                  <Tag fontSize="12" credit={subject.학점}>
                    {subject.학점}학점
                  </Tag>
                </TagContainer>
                <SubjectTable>
                  <TableBody>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        학과
                      </TableHead>
                      <TableData corner={false}>경영학과</TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        과목번호
                      </TableHead>
                      <TableData corner={false}>
                        {subject.subject_id.substring(5)}
                      </TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        강의계획서
                      </TableHead>
                      <TableData corner={false}>조회하기</TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        학점
                      </TableHead>
                      <TableData corner={false}>{subject.학점}</TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        강의시간
                      </TableHead>
                      <TableData corner={false}>
                        {subject.요일} {subject.시작시간}~{subject.종료시간}
                      </TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        교수
                      </TableHead>
                      <TableData corner={false}>{subject.교수진}</TableData>
                    </TableRow>
                    <TableRow>
                      <TableHead scope="row" corner={false}>
                        수강대상
                      </TableHead>
                      <TableData corner={false}>전학년</TableData>
                    </TableRow>

                    <TableRow>
                      <TableHead scope="row" corner={true}>
                        비고
                      </TableHead>
                      <TableData corner={true}>
                        {subject.비고 ? subject.비고 : '없음'}
                      </TableData>
                    </TableRow>
                  </TableBody>
                </SubjectTable>
              </>
            )}
          </DetailbarContent>
          {/* //최근 본 과목, 즐겨찾기 */}
          <StackContent>
            <OptionBtnContainer>
              <GradationBtn
                width={120}
                borderRadius={20}
                active={latestAndFavoritesToggle}
                onClick={switchLatestAndFavorites}
                marginRight={-16}
              >
                최근 본 과목
              </GradationBtn>
              <GradationBtn
                width={120}
                borderRadius={20}
                active={!latestAndFavoritesToggle}
                onClick={switchLatestAndFavorites}
                marginRight={-16}
              >
                즐겨찾기
              </GradationBtn>
            </OptionBtnContainer>
            <SubjectList>
              {latestAndFavoritesToggle
                ? latestList.map((sub, index) => (
                    <>
                      <Subject
                        key={sub.subject_id}
                        subject={sub}
                        onClick={clickCard}
                        active={true}
                      ></Subject>
                      {index !== latestList.length - 1 && <Divider></Divider>}
                    </>
                  ))
                : favoriteList.map((sub, index) => (
                    <>
                      <Subject
                        key={sub.subject_id}
                        subject={sub}
                        onClick={clickCard}
                        active={true}
                      ></Subject>
                      {index !== favoriteList.length - 1 && <Divider></Divider>}
                    </>
                  ))}
            </SubjectList>
          </StackContent>
        </DetailContainer>
      </DetailbarComponent>
    </>
  );
};

export default DetailBar;
