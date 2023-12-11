import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { TableHeader } from "../Table";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const JoinPaper = () => {
  const { user, setPaperList } = useContext(UserContext);
  const [error, setError] = useState("");
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const getallPapers = async () => {
      try {
        const response = await axios.get("paper/manage/" + user._id);
        setPapers(response.data);
      } catch (err) {
        setError(err);
      }
    };
    getallPapers();

    const updatePapers = async () => {
      const response = await axios.get(`paper/student/${user._id}`);
      setPaperList(response.data);
    };
    // updating paperList while component unmounts
    return () => updatePapers();
  }, [user, setPaperList]);

  const handleJoin = async (e) => {
    const paperId = e.currentTarget.id;
    const index = e.target.name;
    const students = papers[index].students;
    students.push(user._id);
    updateStudents(paperId, students, index);
  };

  const handleLeave = async (e) => {
    const paperId = e.currentTarget.id;
    const index = e.target.name;
    const students = papers[index].students;
    const updatedStudents = students.filter((student) => student !== user._id);
    updateStudents(paperId, updatedStudents, index);
  };

  const updateStudents = async (paperId, studentsObj, paperIndex) => {
    setError("");
    try {
      const response = await axios.patch("/paper/" + paperId, {
        students: studentsObj,
        id: paperId,
      });
      toast.success(response.data.message);
      const updatedPaper = papers.map((paper, index) => {
        if (index === parseInt(paperIndex)) {
          paper.joined = !paper.joined;
          return paper;
        } else return paper;
      });
      setPapers(updatedPaper);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      {user.role === "student" ? (
        <main>
          <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-white md:text-6xl">
            Manage Course
          </h2>
          <form>
            {papers.length ? (
              <>
                <div className="my-4 w-full overflow-auto rounded-md border-2 border-black-900 dark:border-slate-500 dark:p-[1px]">
                  <table className="w-full text-left">
                    <TableHeader
                      AdditionalRowClasses={"rounded-t-xl text-left"}
                      Headers={[
                        "Course",
                        "Department",
                        "Year",
                        "Semester",
                        "Professor",
                        "Manage",
                      ]}
                    />
                    <tbody>
                      {papers?.map((paper, index) => (
                        <tr key={index}>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {paper.paper}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {paper.department}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {paper.year}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {paper.semester}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {paper.teacher.name}
                          </td>
                          <td className="border-t-[1px] border-slate-400 p-0">
                            {!paper.joined ? (
                              <button
                                type="button"
                                id={paper._id}
                                name={index}
                                onClick={(e) => handleJoin(e)}
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-violet-900 hover:text-slate-100 dark:text-slate-100 "
                              >
                                Register
                              </button>
                            ) : (
                              <button
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-red-600 hover:text-slate-100 dark:text-slate-100 "
                                type="button"
                                id={paper._id}
                                name={index}
                                onClick={(e) => handleLeave(e)}
                              >
                                Drop Course
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <Loading />
            )}
          </form>
          {error ? <ErrorStrip error={error} /> : ""}
        </main>
      ) : (
        <Navigate to="/dash" />
      )}
    </>
  );
};

export default JoinPaper;
