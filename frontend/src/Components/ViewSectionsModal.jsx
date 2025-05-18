import { Pencil, Trash } from "lucide-react";
import sectionStore from "../store/sectionStore";

const ViewSectionsModal = () => {
  const { sections, delSection, getSection } = sectionStore();

  const handleViewSection = (id) => {
    document.getElementById("createSection").showModal();
    getSection(id);
  };
  return (
    <dialog id="ViewSections" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("ViewSections").close()}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">Sections</h3>

        <div className="overflow-x-auto rounded-box border mt-2 border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th colSpan={2}>Section Name</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec) => (
                <tr key={sec._id}>
                  <td colSpan={2}>{sec?.sectionName}</td>
                  <td>
                    <button
                      className="btn btn-square bg-red-500 mr-2 btn-sm"
                      onClick={() => delSection(sec._id)}
                    >
                      <Trash className="size-4" />
                    </button>
                    <button
                      className="btn btn-square btn-primary btn-sm"
                      onClick={() => handleViewSection(sec._id)}
                    >
                      <Pencil className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  );
};

export default ViewSectionsModal;
