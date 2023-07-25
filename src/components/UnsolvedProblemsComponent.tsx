import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

import fetchUnsolvedProblems from '../utils/fetchUnsolvedProblems';


interface CodeforcesProblem {
  contestId: number;
  index: string;
}
const HandlesList = ['Jobaidul', 'Parag_AP'];

const UnsolvedProblemsComponent: React.FC = () => {
  const [unsolvedProblems, setUnsolvedProblems] = useState<CodeforcesProblem[]>([]);

  useEffect(() => {
    const fetchUnsolved = async () => {
      const unsolved = await fetchUnsolvedProblems(HandlesList);
      setUnsolvedProblems(unsolved);
    };

    fetchUnsolved();
  }, []);

  return (
      <Container maxWidth="sm" sx={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Unsolved Codeforces Problems
      </Typography>
      <List>
        {unsolvedProblems.map((problem) => (
          <ListItem key={`${problem.contestId}-${problem.index}`} sx={{ justifyContent: 'center' }}>
            <ListItemText
              primary={
                <Link
                  href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${problem.contestId}-${problem.index}`}
                </Link>
              }
              primaryTypographyProps={{ variant: 'h6' }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UnsolvedProblemsComponent;
