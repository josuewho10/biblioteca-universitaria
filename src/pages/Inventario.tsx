import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Book, BookInput, Category, CategoryInput } from '../types'
import { generateId, getCategorias, getLibros, saveCategorias, saveLibros } from '../utils/storage'
import { InputField, SelectField, TextAreaField } from '../components/FormFields'
import './Inventario.css'

type Pestana = 'libros' | 'categorias'
type Errores<T> = Partial<Record<keyof T, string>>
type Aviso = { tipo: 'ok' | 'error'; texto: string } | null

const CATEGORIA_VACIA: CategoryInput = { nombre: '', descripcion: '' }
const LIBRO_VACIO: BookInput = { titulo: '', autor: '', isbn: '', categoriaId: '', stock: 0 }

const normalizar = (t: string) => t.trim().toLowerCase()
const limpiarIsbn = (isbn: string) => isbn.replace(/[-\s]/g, '')

// =====================================================================
// Componente principal: guarda el estado y lo sincroniza con Local Storage
// =====================================================================
export default function Inventario() {
  const [pestana, setPestana] = useState<Pestana>('libros')
  const [categorias, setCategorias] = useState<Category[]>(getCategorias)
  const [libros, setLibros] = useState<Book[]>(getLibros)
  const [aviso, setAviso] = useState<Aviso>(null)

  const mostrarAviso = (tipo: 'ok' | 'error', texto: string) => {
    setAviso({ tipo, texto })
    window.setTimeout(() => setAviso(null), 3000)
  }

  // Cada cambio actualiza el estado y Local Storage al mismo tiempo
  const actualizarCategorias = (lista: Category[]) => {
    setCategorias(lista)
    if (!saveCategorias(lista)) mostrarAviso('error', 'No se pudo guardar en Local Storage.')
  }

  const actualizarLibros = (lista: Book[]) => {
    setLibros(lista)
    if (!saveLibros(lista)) mostrarAviso('error', 'No se pudo guardar en Local Storage.')
  }

  return (
    <section className="inv">
      <header className="inv-cabecera">
        <div>
          <h1>Inventario</h1>
          <p className="inv-sub">Gestión de categorías y libros de la biblioteca</p>
        </div>
        <div className="inv-resumen">
          <span><strong>{categorias.length}</strong> categorías</span>
          <span><strong>{libros.length}</strong> libros</span>
          <span><strong>{libros.reduce((t, l) => t + l.stock, 0)}</strong> ejemplares</span>
        </div>
      </header>

      <div className="inv-pestanas" role="tablist">
        <button type="button" role="tab" aria-selected={pestana === 'libros'}
          className={pestana === 'libros' ? 'activa' : ''} onClick={() => setPestana('libros')}>
          Libros
        </button>
        <button type="button" role="tab" aria-selected={pestana === 'categorias'}
          className={pestana === 'categorias' ? 'activa' : ''} onClick={() => setPestana('categorias')}>
          Categorías
        </button>
      </div>

      {aviso && <p className={`inv-aviso inv-aviso-${aviso.tipo}`} role="status">{aviso.texto}</p>}

      {pestana === 'libros' ? (
        <GestionLibros
          libros={libros}
          categorias={categorias}
          onChange={actualizarLibros}
          onAviso={mostrarAviso}
          irACategorias={() => setPestana('categorias')}
        />
      ) : (
        <GestionCategorias
          categorias={categorias}
          libros={libros}
          onChange={actualizarCategorias}
          onAviso={mostrarAviso}
        />
      )}
    </section>
  )
}

// =====================================================================
// CRUD de Categorías
// =====================================================================
interface GestionCategoriasProps {
  categorias: Category[]
  libros: Book[]
  onChange: (lista: Category[]) => void
  onAviso: (tipo: 'ok' | 'error', texto: string) => void
}

function GestionCategorias({ categorias, libros, onChange, onAviso }: GestionCategoriasProps) {
  const [form, setForm] = useState<CategoryInput>(CATEGORIA_VACIA)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [errores, setErrores] = useState<Errores<CategoryInput>>({})

  const cambiar = (campo: keyof CategoryInput, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const validar = (): Errores<CategoryInput> => {
    const e: Errores<CategoryInput> = {}
    if (form.nombre.trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres.'
    else if (categorias.some((c) => c.id !== editandoId && normalizar(c.nombre) === normalizar(form.nombre)))
      e.nombre = 'Ya existe una categoría con ese nombre.'
    if (form.descripcion.trim().length < 5) e.descripcion = 'La descripción debe tener al menos 5 caracteres.'
    return e
  }

  const cancelar = () => {
    setForm(CATEGORIA_VACIA)
    setEditandoId(null)
    setErrores({})
  }

  const enviar = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    const datos: CategoryInput = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() }
    if (editandoId) {
      onChange(categorias.map((c) => (c.id === editandoId ? { ...c, ...datos } : c)))
      onAviso('ok', 'Categoría actualizada.')
    } else {
      onChange([...categorias, { id: generateId(), ...datos }])
      onAviso('ok', 'Categoría registrada.')
    }
    cancelar()
  }

  const editar = (c: Category) => {
    setForm({ nombre: c.nombre, descripcion: c.descripcion })
    setEditandoId(c.id)
    setErrores({})
  }

  const eliminar = (c: Category) => {
    // Integridad: no se borra una categoría que todavía tiene libros
    const enUso = libros.filter((l) => l.categoriaId === c.id).length
    if (enUso > 0) {
      onAviso('error', `No se puede eliminar "${c.nombre}": tiene ${enUso} libro(s) asociados.`)
      return
    }
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return
    onChange(categorias.filter((x) => x.id !== c.id))
    if (editandoId === c.id) cancelar()
    onAviso('ok', 'Categoría eliminada.')
  }

  return (
    <div className="inv-layout">
      <form className="inv-form" onSubmit={enviar} noValidate>
        <h2>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <InputField id="cat-nombre" label="Nombre" value={form.nombre} error={errores.nombre}
          onChange={(v) => cambiar('nombre', v)} placeholder="Ej. Ingeniería" />
        <TextAreaField id="cat-descripcion" label="Descripción" value={form.descripcion} error={errores.descripcion}
          onChange={(v) => cambiar('descripcion', v)} />
        <div className="inv-acciones">
          <button type="submit" className="inv-btn">{editandoId ? 'Actualizar' : 'Registrar'}</button>
          {editandoId && <button type="button" className="inv-btn inv-btn-sec" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <div className="inv-tabla-contenedor">
        {categorias.length === 0 ? (
          <p className="inv-vacio">Aún no hay categorías. Registra la primera con el formulario.</p>
        ) : (
          <table className="inv-tabla">
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th>Libros</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id} className={editandoId === c.id ? 'inv-fila-editando' : ''}>
                  <td data-label="Nombre"><strong>{c.nombre}</strong></td>
                  <td data-label="Descripción">{c.descripcion}</td>
                  <td data-label="Libros">{libros.filter((l) => l.categoriaId === c.id).length}</td>
                  <td data-label="Acciones">
                    <div className="inv-acciones">
                      <button type="button" className="inv-btn-link" onClick={() => editar(c)}>Editar</button>
                      <button type="button" className="inv-btn-link inv-peligro" onClick={() => eliminar(c)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// =====================================================================
// CRUD de Libros
// =====================================================================
interface GestionLibrosProps {
  libros: Book[]
  categorias: Category[]
  onChange: (lista: Book[]) => void
  onAviso: (tipo: 'ok' | 'error', texto: string) => void
  irACategorias: () => void
}

function GestionLibros({ libros, categorias, onChange, onAviso, irACategorias }: GestionLibrosProps) {
  const [form, setForm] = useState<BookInput>(LIBRO_VACIO)
  const [stockTexto, setStockTexto] = useState('0') // texto del input para poder validar vacío
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [errores, setErrores] = useState<Errores<BookInput>>({})
  const [busqueda, setBusqueda] = useState('')

  const nombreCategoria = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? 'Sin categoría'

  const cambiar = (campo: Exclude<keyof BookInput, 'stock'>, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const validar = (): Errores<BookInput> => {
    const e: Errores<BookInput> = {}
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio.'
    if (form.autor.trim().length < 3) e.autor = 'El autor debe tener al menos 3 caracteres.'

    const isbn = limpiarIsbn(form.isbn)
    if (!/^(\d{9}[\dX]|\d{13})$/i.test(isbn)) e.isbn = 'El ISBN debe tener 10 o 13 dígitos.'
    else if (libros.some((l) => l.id !== editandoId && limpiarIsbn(l.isbn) === isbn))
      e.isbn = 'Ya existe un libro con ese ISBN.'

    if (!categorias.some((c) => c.id === form.categoriaId)) e.categoriaId = 'Selecciona una categoría.'

    const stock = Number(stockTexto)
    if (stockTexto.trim() === '' || !Number.isInteger(stock) || stock < 0)
      e.stock = 'El stock debe ser un número entero mayor o igual a 0.'
    return e
  }

  const cancelar = () => {
    setForm(LIBRO_VACIO)
    setStockTexto('0')
    setEditandoId(null)
    setErrores({})
  }

  const enviar = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    const datos: BookInput = {
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      isbn: form.isbn.trim(),
      categoriaId: form.categoriaId,
      stock: Number(stockTexto),
    }
    if (editandoId) {
      onChange(libros.map((l) => (l.id === editandoId ? { ...l, ...datos } : l)))
      onAviso('ok', 'Libro actualizado.')
    } else {
      onChange([...libros, { id: generateId(), ...datos }])
      onAviso('ok', 'Libro registrado.')
    }
    cancelar()
  }

  const editar = (l: Book) => {
    setForm({ titulo: l.titulo, autor: l.autor, isbn: l.isbn, categoriaId: l.categoriaId, stock: l.stock })
    setStockTexto(String(l.stock))
    setEditandoId(l.id)
    setErrores({})
  }

  const eliminar = (l: Book) => {
    if (!window.confirm(`¿Eliminar el libro "${l.titulo}"?`)) return
    onChange(libros.filter((x) => x.id !== l.id))
    if (editandoId === l.id) cancelar()
    onAviso('ok', 'Libro eliminado.')
  }

  const filtrados = libros.filter((l) => {
    const q = normalizar(busqueda)
    return !q || [l.titulo, l.autor, l.isbn, nombreCategoria(l.categoriaId)].some((t) => normalizar(t).includes(q))
  })

  return (
    <div className="inv-layout">
      <form className="inv-form" onSubmit={enviar} noValidate>
        <h2>{editandoId ? 'Editar libro' : 'Nuevo libro'}</h2>

        {categorias.length === 0 && (
          <p className="inv-aviso inv-aviso-error">
            Primero registra una categoría.{' '}
            <button type="button" className="inv-btn-link" onClick={irACategorias}>Ir a categorías</button>
          </p>
        )}

        <InputField id="lib-titulo" label="Título" value={form.titulo} error={errores.titulo}
          onChange={(v) => cambiar('titulo', v)} />
        <InputField id="lib-autor" label="Autor" value={form.autor} error={errores.autor}
          onChange={(v) => cambiar('autor', v)} />
        <InputField id="lib-isbn" label="ISBN" value={form.isbn} error={errores.isbn}
          onChange={(v) => cambiar('isbn', v)} placeholder="978-84-376-0494-7" />
        <SelectField id="lib-categoria" label="Categoría" value={form.categoriaId} error={errores.categoriaId}
          onChange={(v) => cambiar('categoriaId', v)}
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))} />
        <InputField id="lib-stock" label="Stock disponible" type="number" min={0} value={stockTexto} error={errores.stock}
          onChange={(v) => { setStockTexto(v); setErrores((e) => ({ ...e, stock: undefined })) }} />

        <div className="inv-acciones">
          <button type="submit" className="inv-btn" disabled={categorias.length === 0}>
            {editandoId ? 'Actualizar' : 'Registrar'}
          </button>
          {editandoId && <button type="button" className="inv-btn inv-btn-sec" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <div className="inv-tabla-contenedor">
        <input
          className="inv-buscador"
          type="search"
          placeholder="Buscar por título, autor, ISBN o categoría"
          aria-label="Buscar libros"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {libros.length === 0 ? (
          <p className="inv-vacio">Aún no hay libros registrados.</p>
        ) : filtrados.length === 0 ? (
          <p className="inv-vacio">Ningún libro coincide con “{busqueda}”.</p>
        ) : (
          <table className="inv-tabla">
            <thead>
              <tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Categoría</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtrados.map((l) => (
                <tr key={l.id} className={editandoId === l.id ? 'inv-fila-editando' : ''}>
                  <td data-label="Título"><strong>{l.titulo}</strong></td>
                  <td data-label="Autor">{l.autor}</td>
                  <td data-label="ISBN">{l.isbn}</td>
                  <td data-label="Categoría">{nombreCategoria(l.categoriaId)}</td>
                  <td data-label="Stock">
                    <span className={l.stock === 0 ? 'inv-stock inv-stock-cero' : 'inv-stock'}>
                      {l.stock === 0 ? 'Agotado' : l.stock}
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <div className="inv-acciones">
                      <button type="button" className="inv-btn-link" onClick={() => editar(l)}>Editar</button>
                      <button type="button" className="inv-btn-link inv-peligro" onClick={() => eliminar(l)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
