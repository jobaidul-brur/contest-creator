import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Container, Typography, Grid, Link } from '@mui/material';

interface CodeforcesProblem {
  contestId: number;
  index: string;
}

interface UnsolvedProblemsComponentProps {
  handles: string[];
}

const UnsolvedProblemsComponent: React.FC<UnsolvedProblemsComponentProps> = ({ handles }) => {
  const [unsolvedProblems, setUnsolvedProblems] = useState<CodeforcesProblem[]>([]);

  async function fetchSolvedProblems(handle: string): Promise<number[]> {
    try {
      const response: AxiosResponse<{ result: any[] }> = await axios.get(
        'https://codeforces.com/api/user.status',
        {
          params: {
            handle,
          },
        }
      );

      const solvedProblems: Set<number> = new Set();
      response.data.result.forEach((submission: any) => {
        if (submission.verdict === 'OK') {
          const problemId = submission.problem.contestId * 1000 + submission.problem.index.charCodeAt(0) - 'A'.charCodeAt(0);
          solvedProblems.add(problemId);
        }
      });

      return Array.from(solvedProblems);
    } catch (error) {
      console.error(`Error fetching solved problems for handle ${handle}:`, error);
      return [];
    }
  }

  async function fetchUnsolvedProblems(handles: string[]): Promise<CodeforcesProblem[]> {
    try {
      const solvedProblemsSet: Set<number> = new Set();

      // Fetch solved problems for each handle and combine into the set
      for (const handle of handles) {
        const solvedProblems = await fetchSolvedProblems(handle);
        solvedProblems.forEach((problemId) => {
          solvedProblemsSet.add(problemId);
        });
      }

      // Fetch all Codeforces problems
      const response: AxiosResponse<{ result: { problems: CodeforcesProblem[] } }> = await axios.get(
        'https://codeforces.com/api/problemset.problems'
      );
      const allProblems: CodeforcesProblem[] = response.data.result.problems;

      // Filter out problems that are not solved by any handle
      const unsolvedProblems: CodeforcesProblem[] = allProblems.filter((problem) => {
        const problemId = problem.contestId * 1000 + problem.index.charCodeAt(0) - 'A'.charCodeAt(0);
        return !solvedProblemsSet.has(problemId);
      });

      // Return the first 100 unsolved problems
      return unsolvedProblems.slice(0, 100);
    } catch (error) {
      console.error('Error fetching unsolved problems:', error);
      return [];
    }
  }

  useEffect(() => {
    const fetchUnsolved = async () => {
      const unsolved = await fetchUnsolvedProblems(handles);
      setUnsolvedProblems(unsolved);
    };

    fetchUnsolved();
  }, [handles]);

  // Format handles into comma-separated string
  const handlesList = handles.join(', ');

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Unsolved Codeforces Problems
      </Typography>
      <pre style={{ fontFamily: 'monospace', fontSize: '14px' }}>{handlesList}</pre>
      <Grid container spacing={2} justifyContent="center">
        {unsolvedProblems.map((problem, index) => (
          <Grid item xs={6} sm={4} md={3} key={`${problem.contestId}-${problem.index}`}>
            <Link
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="none"
            >
              <Typography variant="h6">{`${problem.contestId}-${problem.index}`}</Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UnsolvedProblemsComponent;
