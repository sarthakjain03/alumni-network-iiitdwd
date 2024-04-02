import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { get_fetcher } from "../utils/Fetcher";
import Navbar from "../template/Navbar";
import Footer from "../template/Footer";
import { Grid } from "@mui/material";
import { JobsFilterButton } from "../components/jobsFilterButton";
import { JobsCard } from "../components/Cards";

const Jobs = () => {
  const { data, isLoading } = useSWR(
    "http://localhost:5000/job/getAll",
    get_fetcher
  );

  useEffect(() => {
    if (data) {
      console.log("Data: ", data);
    }
  }, [isLoading, data]);

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    myjobs: false,
    addjob: false,
    jobs: false,
    internships: false,
    year2022: false,
    year2023: false,
    year2024: false,
    year2025: false,
    year2026: false,
    year2027: false,
  });

  useEffect(() => {
    if (!data) return;

    let filteredJobs = data.filter((job) => {
      if (filters.jobs && filters.internships) return false; // Either jobs or internships, not both
      if (filters.jobs && job.category !== 0) return false;
      if (filters.internships && job.category !== 1) return false;
      if (filters.year2022 && !job.eligibleBatch.includes(22)) return false;
      if (filters.year2023 && !job.eligibleBatch.includes(23)) return false;
      if (filters.year2024 && !job.eligibleBatch.includes(24)) return false;
      if (filters.year2025 && !job.eligibleBatch.includes(25)) return false;
      if (filters.year2026 && !job.eligibleBatch.includes(26)) return false;
      if (filters.year2027 && !job.eligibleBatch.includes(27)) return false;
      return true;
    });

    setFilteredData(filteredJobs);
  }, [data, filters]);

  const [sort, setSort] = useState({
    recent: true,
    stipend: false,
  });

  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setSortedData(filteredData);
  }, [filteredData]);

  useEffect(() => {
    if (sortedData.length > 0) {
      let sortedJobs = [...sortedData];
      if (sort.recent) {
        sortedJobs.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
      } else if (sort.stipend) {
        sortedJobs.sort((a, b) => b.stipend - a.stipend);
      }
      setSortedData((prevSortedData) => {
        if (JSON.stringify(prevSortedData) !== JSON.stringify(sortedJobs)) {
          return sortedJobs;
        }
        return prevSortedData;
      });
    }
  }, [sort, sortedData]);

  const handleSortClick = (sortName) => {
    setSort((prevSort) => ({
      stipend: false,
      recent: false,
      [sortName]: !prevSort[sortName],
    }));
  };

  const handleFilterClick = (filterName) => {
    if (filterName === "jobs" || filterName === "internships") {
      // If jobs or internships filter is clicked, set the other filter to false
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: !prevFilters[filterName],
        [filterName === "jobs" ? "internships" : "jobs"]: false,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: !prevFilters[filterName],
      }));
    }
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <>
      <div className="bg-backgroundColor">
        <Navbar />
        <div className="mx-24 pt-14">
          <p style={{ marginTop: "100px" }}></p>
          <Grid container>
            <Grid xs={4} className="">
              <div className="bg-white min-h-40 pt-14 pb-14 rounded-md shadow-md">
                <Grid xs={12} className="flex justify-center mb-2">
                  <div className="flex font-bold">
                    <div>
                      <img
                        src="/actions_icon.svg"
                        alt="actions-icon"
                        className="mt-1.5 mr-1 h-6"
                      />
                    </div>
                    <div className="ml-1 text-2xl">Actions</div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <div className="flex">
                    {/* <div onClick={() => handleFilterClick("myjobs")}>
                      <JobsFilterButton name="MY JOBS" used={filters.myjobs} />
                    </div> */}
                    <div
                      className="ml-1"
                      onClick={() => handleFilterClick("addjob")}
                    >
                      <JobsFilterButton name="ADD JOB" used={filters.addjob} />
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center mt-4 mb-2">
                  <div className="flex font-bold">
                    <div>
                      <img
                        src="/filter_icon.svg"
                        alt="filter-icon"
                        className="mt-1.5 mr-1 h-6"
                      />
                    </div>
                    <div className="ml-1 text-2xl">Filter</div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <div className="flex">
                    <div onClick={() => handleFilterClick("myjobs")}>
                      <JobsFilterButton name="MY JOBS" used={filters.myjobs} />
                    </div>
                    <div onClick={() => handleFilterClick("jobs")} className="">
                      <JobsFilterButton name="JOBS" used={filters.jobs} />
                    </div>
                    <div
                      onClick={() => handleFilterClick("internships")}
                      className=""
                    >
                      <JobsFilterButton
                        name="INTERNSHIPS"
                        used={filters.internships}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <div className="flex">
                    <div
                      onClick={() => handleFilterClick("year2022")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2022 BATCH"
                        used={filters.year2022}
                      />
                    </div>
                    <div
                      onClick={() => handleFilterClick("year2023")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2023 BATCH"
                        used={filters.year2023}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <div className="flex">
                    <div
                      onClick={() => handleFilterClick("year2024")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2024 BATCH"
                        used={filters.year2024}
                      />
                    </div>
                    <div
                      onClick={() => handleFilterClick("year2025")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2025 BATCH"
                        used={filters.year2025}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <div className="flex">
                    <div
                      onClick={() => handleFilterClick("year2026")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2026 BATCH"
                        used={filters.year2026}
                      />
                    </div>
                    <div
                      onClick={() => handleFilterClick("year2027")}
                      className=""
                    >
                      <JobsFilterButton
                        name="2027 BATCH"
                        used={filters.year2027}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center mb-2 mt-4">
                  <div className="flex font-bold">
                    <div>
                      <img
                        src="/actions_icon.svg"
                        alt="actions-icon"
                        className="mt-1.5 mr-1 h-6"
                      />
                    </div>
                    <div className="ml-1 text-2xl">Sort By</div>
                  </div>
                </Grid>
                <Grid xs={12} className="flex justify-center ">
                  <div className="flex">
                    <div onClick={() => handleSortClick("recent")}>
                      <JobsFilterButton name="RECENT" used={sort.recent} />
                    </div>
                    <div
                      className="ml-1"
                      onClick={() => handleSortClick("stipend")}
                    >
                      <JobsFilterButton name="STIPEND" used={sort.stipend} />
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
            <Grid xs={1} className="flex items-center justify-center">
              <div className="h-full bg-greyLine w-0.5"></div>
            </Grid>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Grid xs={7} className="">
                {sortedData && sortedData.length > 0 ? (
                  sortedData.map((job, index) => (
                    <div key={index} className="mb-14">
                      <JobsCard
                        jobPosition={job.title}
                        company={job.companyName}
                        location={job.jobLocation}
                        posted={new Date(job.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                        stipend={job.stipend}
                        batch={job.eligibleBatch}
                        postedBy={job.floatedBy}
                        startDate={new Date(job.startDate).toLocaleDateString(
                          "en-GB"
                        )}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center">No Match Found</p>
                )}
              </Grid>
            )}
          </Grid>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Jobs;
